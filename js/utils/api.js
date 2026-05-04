/**
 * api.js
 * Handles all network requests for DigiVault.
 * Includes CORS proxy handling and mock data fallbacks.
 */

const API = {
    /**
     * Hardcoded mock data to ensure the demo works even if local fetch is blocked.
     */
    MOCK_FALLBACK: {
        "breaches": [
            {
                "Name": "LinkedIn",
                "Domain": "linkedin.com",
                "BreachDate": "2021-06-22",
                "Description": "LinkedIn data was exposed in a massive scraping event, including emails, full names, and professional information.",
                "DataClasses": ["Email addresses", "Full names", "Job titles"]
            },
            {
                "Name": "Adobe",
                "Domain": "adobe.com",
                "BreachDate": "2013-10-04",
                "Description": "Adobe suffered a major security breach exposing user account data including encrypted passwords.",
                "DataClasses": ["Email addresses", "Passwords"]
            }
        ]
    },

    /**
     * Fetches breach data from HaveIBeenPwned via CORS proxy.
     * @param {string} email 
     * @returns {Promise<Array>}
     */
    async fetchBreaches(email) {
        if (CONFIG.USE_MOCK_DATA) {
            return this.MOCK_FALLBACK.breaches;
        }

        const url = `${CONFIG.CORS_PROXY}${CONFIG.HIBP_BASE}/breachedaccount/${encodeURIComponent(email)}`;
        
        try {
            const response = await fetch(url);
            
            if (response.status === 404) return [];
            if (!response.ok) throw new Error(`HIBP API Error: ${response.status}`);
            
            return await response.json();
        } catch (error) {
            console.warn("API: Breach check failed, falling back to mock data.", error);
            return this.MOCK_FALLBACK.breaches;
        }
    },

    /**
     * Calls Google Gemini API with streaming response.
     * Uses alt=sse for standard Server-Sent Events parsing.
     * @param {string} prompt 
     * @param {Function} onDelta - Callback for each text chunk
     */
    async callGeminiStreaming(prompt, onDelta) {
        if (!CONFIG.ENABLE_AI_REPORT || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
            onDelta("AI Report is disabled or Gemini API key is missing.");
            return;
        }

        try {
            const url = `${CONFIG.GEMINI_API}?alt=sse&key=${CONFIG.GEMINI_API_KEY}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6).trim();
                        if (!dataStr) continue;
                        
                        try {
                            const parsed = JSON.parse(dataStr);
                            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) onDelta(text);
                        } catch (e) {}
                    }
                }
            }
        } catch (error) {
            console.error("API: AI Report failed", error);
            onDelta(`\n[Error: ${error.message}]`);
            if (window.location.protocol === 'file:') {
                onDelta(`\n\n[Tip: Browser blocked API from file://. Run a local server to fix.]`);
            }
        }
    }
};
