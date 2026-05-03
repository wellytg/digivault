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
     * Calls Google Gemini API with streaming response.
     * Handles the complex JSON-array stream format used by Gemini REST.
     * @param {string} prompt 
     * @param {Function} onDelta - Callback for each text chunk
     */
    async callGeminiStreaming(prompt, onDelta) {
        if (!CONFIG.ENABLE_AI_REPORT || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            onDelta("AI Report is disabled or Gemini API key is missing. Please check config.js.");
            return;
        }

        try {
            const response = await fetch(`${CONFIG.GEMINI_API}?key=${CONFIG.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Gemini API error");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let lastProcessedIndex = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                
                // Gemini returns a JSON array: [ {chunk}, {chunk} ]
                // We extract text from new candidates as they appear in the buffer
                const regex = /"text":\s*"((?:[^"\\]|\\.)*)"/g;
                let match;
                let matchIndex = 0;
                
                while ((match = regex.exec(buffer)) !== null) {
                    if (matchIndex >= lastProcessedIndex) {
                        // Extract and unescape the text chunk
                        const text = match[1]
                            .replace(/\\n/g, '\n')
                            .replace(/\\r/g, '\r')
                            .replace(/\\t/g, '\t')
                            .replace(/\\"/g, '"')
                            .replace(/\\\\/g, '\\');
                        
                        onDelta(text);
                        lastProcessedIndex++;
                    }
                    matchIndex++;
                }
            }
        } catch (error) {
            console.error("API: AI Report failed", error);
            onDelta(`\n[Error generating AI recommendations: ${error.message}]`);
        }
    }
};
