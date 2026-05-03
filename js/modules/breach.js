/**
 * breach.js
 * Handles the "Exposure Report" — checking the email against breach databases.
 */

/**
 * Executes the breach check phase.
 * @param {string} email 
 * @returns {Promise<Array>}
 */
async function runBreachCheck(email) {
    return await API.fetchBreaches(email);
}

/**
 * Renders breach results into the DOM.
 * @param {Array} breaches 
 */
function renderBreachReport(breaches) {
    const container = document.getElementById('breach-report');
    if (!container) return;

    if (breaches.length === 0) {
        container.innerHTML = `
            <div class="breach-success-card">
                <span class="breach-icon-large">✅</span>
                <h3>No Exposure Detected</h3>
                <p>We didn't find your email in any major known breach databases. This is a great start!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <h2 class="section-title">Exposure Report</h2>
        <p class="section-subtitle">Your email was found in <strong>${breaches.length}</strong> known data breaches.</p>
        <div class="breach-cards-container">
            ${breaches.map(b => renderBreachCard(b)).join('')}
        </div>
    `;
}

/**
 * Helper to render an individual breach card.
 * @param {Object} breach 
 * @returns {string} HTML string
 */
function renderBreachCard(breach) {
    return `
        <div class="breach-card">
            <div class="breach-header">
                <span class="breach-name">${breach.Name}</span>
                <span class="breach-date">${HELPERS.formatDate(breach.BreachDate)}</span>
            </div>
            <p class="breach-description">${breach.Description}</p>
            <div class="breach-tags">
                ${breach.DataClasses.map(tag => `<span class="breach-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
}
