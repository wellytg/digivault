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

    // Store results globally for re-calculation when verified
    window.currentReconResults = results;

    container.innerHTML = `
        <h2 class="section-title">Your Public Face</h2>
        <p class="section-subtitle">Click <strong>"This is Me"</strong> to verify which profiles belong to you. Verified profiles increase your exposure risk.</p>
        <div class="results-grid">
            <div class="results-column">
                <h3>Social Profiles</h3>
                <div class="cards-container">
                    ${results.social.map((p, i) => renderReconCard(p, 'social', i)).join('')}
                </div>
            </div>
            <div class="results-column">
                <h3>Search Records</h3>
                <div class="cards-container">
                    ${results.search.map((p, i) => renderReconCard(p, 'search', i)).join('')}
                </div>
            </div>
            <div class="results-column">
                <h3>Data Brokers</h3>
                <div class="cards-container">
                    ${results.dataBrokers.map((p, i) => renderReconCard(p, 'broker', i)).join('')}
                </div>
            </div>
        </div>
    `;

    // Add event delegation for verification buttons
    container.addEventListener('click', (e) => {
        const verifyBtn = e.target.closest('.verify-btn');
        if (verifyBtn) {
            const type = verifyBtn.dataset.type;
            const index = verifyBtn.dataset.index;
            toggleVerification(type, index, verifyBtn);
        }
    });
}

/**
 * Helper to render an individual recon card.
 * @param {Object} item 
 * @param {string} type - category type
 * @param {number} index - index in category
 * @returns {string} HTML string
 */
function renderReconCard(item, type, index) {
    const actionLabel = item.isSearch ? "Search Profile →" : "View Profile →";
    const isVerified = item.verified ? 'verified' : '';
    const btnText = item.verified ? '✅ Verified' : 'This is Me';

    return `
        <div class="recon-card-wrapper ${isVerified}" data-type="${type}" data-index="${index}">
            <a href="${item.url}" target="_blank" class="recon-card">
                <span class="recon-icon">${item.icon}</span>
                <div class="recon-info">
                    <span class="recon-platform">${item.platform}</span>
                    <span class="recon-action">${actionLabel}</span>
                </div>
            </a>
            <button class="verify-btn" data-type="${type}" data-index="${index}">${btnText}</button>
        </div>
    `;
}

/**
 * Toggles the verification status of a profile.
 * @param {string} type 
 * @param {number} index 
 * @param {HTMLElement} btn 
 */
function toggleVerification(type, index, btn) {
    const results = window.currentReconResults;
    let target;

    if (type === 'social') target = results.social[index];
    else if (type === 'search') target = results.search[index];
    else if (type === 'broker') target = results.dataBrokers[index];

    if (!target) return;

    // Toggle state
    target.verified = !target.verified;

    // Update UI
    const wrapper = btn.closest('.recon-card-wrapper');
    if (target.verified) {
        wrapper.classList.add('verified');
        btn.textContent = '✅ Verified';
    } else {
        wrapper.classList.remove('verified');
        btn.textContent = 'This is Me';
    }

    // Trigger score re-calculation (defined in app.js)
    if (window.updateLiveScore) {
        window.updateLiveScore();
    }
}
