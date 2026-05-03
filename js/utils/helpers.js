/**
 * helpers.js
 * Utility functions for URL construction, formatting, and scoring.
 */

const HELPERS = {
    /**
     * Constructs search and profile URLs for the recon module.
     * @param {string} name 
     * @param {Object} handles - Optional social handles { linkedin, twitter, instagram }
     * @returns {Object}
     */
    buildProfileUrls(name, handles = {}) {
        const encodedName = encodeURIComponent(name);
        const dashName = encodeURIComponent(name.replace(/\s+/g, '-'));
        const tagName = encodeURIComponent(name.replace(/\s+/g, '')).toLowerCase();

        return {
            social: [
                { 
                    platform: 'LinkedIn', 
                    url: handles.linkedin ? `https://linkedin.com/in/${handles.linkedin}` : `https://linkedin.com/search/results/people/?keywords=${encodedName}`, 
                    icon: '💼',
                    isSearch: !handles.linkedin
                },
                { 
                    platform: 'Twitter/X', 
                    url: handles.twitter ? `https://twitter.com/${handles.twitter.replace('@', '')}` : `https://twitter.com/search?q=${encodedName}`, 
                    icon: '🐦',
                    isSearch: !handles.twitter
                },
                { 
                    platform: 'Facebook', 
                    url: `https://facebook.com/search/people/?q=${encodedName}`, 
                    icon: '👥',
                    isSearch: true
                },
                { 
                    platform: 'Instagram', 
                    url: handles.instagram ? `https://instagram.com/${handles.instagram.replace('@', '')}` : `https://instagram.com/explore/tags/${tagName}`, 
                    icon: '📸',
                    isSearch: !handles.instagram
                }
            ],
            search: [
                { platform: 'Google', url: `https://google.com/search?q="${encodedName}"`, icon: '🔍' },
                { platform: 'Google News', url: `https://news.google.com/search?q=${encodedName}`, icon: '📰' },
                { platform: 'Google Images', url: `https://google.com/search?q="${encodedName}"&tbm=isch`, icon: '🖼️' }
            ],
            dataBrokers: [
                { platform: 'Spokeo', url: `https://spokeo.com/${dashName}`, icon: '📂' },
                { platform: 'Whitepages', url: `https://whitepages.com/name/${dashName}`, icon: '📖' }
            ]
        };
    },

    /**
     * Maps a numerical score (0-100) to a threat level string and class.
     * @param {number} score 
     * @returns {Object}
     */
    getThreatLevel(score) {
        if (score >= 75) return { label: 'LOW RISK', class: 'low' };
        if (score >= 50) return { label: 'MEDIUM RISK', class: 'medium' };
        if (score >= 25) return { label: 'HIGH RISK', class: 'high' };
        return { label: 'CRITICAL', class: 'critical' };
    },

    /**
     * Formats an ISO date string into a more readable format.
     * @param {string} dateString 
     * @returns {string}
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return dateString;
        }
    }
};
