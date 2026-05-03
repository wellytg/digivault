/**
 * recon.js
 * Handles the "Public Face" scan — constructing links to social profiles and search results.
 */

/**
 * Executes the recon phase by building profile and search links.
 * @param {string} name 
 * @param {Object} handles 
 * @returns {Promise<Object>}
 */
async function runRecon(name, handles) {
    // In a real app, this might fetch metadata, but for this MVP we construct links.
    const results = HELPERS.buildProfileUrls(name, handles);
    return results;
}

/**
 * Renders recon results into the DOM.
 * @param {Object} results 
 */
function renderRecon(results) {
    const container = document.getElementById('public-face');
    if (!container) return;

    container.innerHTML = `
        <h2 class="section-title">Your Public Face</h2>
        <div class="results-grid">
            <div class="results-column">
                <h3>Social Profiles</h3>
                <div class="cards-container">
                    ${results.social.map(p => renderReconCard(p)).join('')}
                </div>
            </div>
            <div class="results-column">
                <h3>Search Records</h3>
                <div class="cards-container">
                    ${results.search.map(p => renderReconCard(p)).join('')}
                </div>
            </div>
            <div class="results-column">
                <h3>Data Brokers</h3>
                <div class="cards-container">
                    ${results.dataBrokers.map(p => renderReconCard(p)).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Helper to render an individual recon card.
 * @param {Object} item 
 * @returns {string} HTML string
 */
function renderReconCard(item) {
    const actionLabel = item.isSearch ? "Search Profile →" : "View Profile →";
    return `
        <a href="${item.url}" target="_blank" class="recon-card">
            <span class="recon-icon">${item.icon}</span>
            <div class="recon-info">
                <span class="recon-platform">${item.platform}</span>
                <span class="recon-action">${actionLabel}</span>
            </div>
        </a>
    `;
}
