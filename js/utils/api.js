/**
 * api.js
 * Handles all network requests for DigiVault.
 * Includes CORS proxy handling and mock data fallbacks.
 */

const API = {
    /**
     * Fetches breach data from HaveIBeenPwned via CORS proxy.
     * @param {string} email 
     * @returns {Promise<Array>}
     */
    async fetchBreaches(email) {
        if (CONFIG.USE_MOCK_DATA) {
            console.log("API: Using mock data (forced in config)");
            return (await this.fetchMockData()).breaches;
        }

        const url = `${CONFIG.CORS_PROXY}${CONFIG.HIBP_BASE}/breachedaccount/${encodeURIComponent(email)}`;
        
        try {
            const response = await fetch(url);
            
            if (response.status === 404) {
                // 404 means no breaches found - this is a success state for the user!
                return [];
            }
            
            if (!response.ok) {
                throw new Error(`HIBP API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("API: Breach check failed, falling back to mock data.", error);
            return (await this.fetchMockData()).breaches;
        }
    },

    /**
     * Loads local mock data for demo reliability.
     * @returns {Promise<Object>}
     */
    async fetchMockData() {
        try {
            const response = await fetch('data/mock-results.json');
            return await response.json();
        } catch (error) {
            console.error("API: Failed to load mock-results.json", error);
            return { breaches: [] };
        }
    },

    /**
     * Calls Anthropic API with streaming response.
     * @param {string} prompt 
     * @param {Function} onDelta - Callback for each text chunk
     */
    async callClaudeStreaming(prompt, onDelta) {
        if (!CONFIG.ENABLE_AI_REPORT || CONFIG.ANTHROPIC_API_KEY === 'YOUR_ANTHROPIC_API_KEY_HERE') {
            onDelta("AI Report is disabled or API key is missing. Please check config.js.");
            return;
        }

        try {
            const response = await fetch(CONFIG.ANTHROPIC_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': CONFIG.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: CONFIG.CLAUDE_MODEL,
                    max_tokens: 600,
                    stream: true,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Claude API error");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value);
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') return;
                        
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.type === 'content_block_delta') {
                                const text = parsed.delta?.text || '';
                                onDelta(text);
                            }
                        } catch (e) {
                            // Ignore partial JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error("API: AI Report failed", error);
            onDelta(`\n[Error generating AI recommendations: ${error.message}]`);
        }
    }
};
