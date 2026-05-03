/**
 * vault-score.js
 * Calculates and renders the DigiScore (formerly VaultScore).
 */

/**
 * Calculates the DigiScore (0-100) based on weighted exposure signals.
 * @param {Object} reconResults 
 * @param {Array} breachResults 
 * @returns {number}
 */
function calculateDigiScore(reconResults, breachResults) {
    let score = 100;

    // 1. Breach penalty (40% weight = max 40 points)
    const breachPenalty = Math.min(breachResults.length * 8, 40);
    score -= breachPenalty;

    // 2. Profile visibility penalty (30% weight = max 30 points)
    // Verified profiles = 6 points each
    // Unverified/Search results = 2 points each
    const verifiedCount = [
        ...reconResults.social, 
        ...reconResults.search, 
        ...reconResults.dataBrokers
    ].filter(p => p.verified).length;

    const unverifiedCount = [
        ...reconResults.social, 
        ...reconResults.search
    ].filter(p => !p.verified).length;

    const profilePenalty = Math.min((verifiedCount * 6) + (unverifiedCount * 2), 30);
    score -= profilePenalty;

    // 3. Data broker presence (20% = 20 points)
    // If any data broker is verified, max penalty.
    const verifiedBrokers = reconResults.dataBrokers.filter(p => p.verified).length;
    const brokerPenalty = verifiedBrokers > 0 ? 20 : (reconResults.dataBrokers.length > 0 ? 10 : 0);
    score -= brokerPenalty;

    // 4. Email exposure (10% = 10 points)
    const emailExposurePenalty = breachResults.length > 0 ? 10 : 0;
    score -= emailExposurePenalty;

    return Math.max(score, 0);
}

/**
 * Renders the DigiScore badge and threat level into the DOM.
 * @param {number} score 
 */
function renderDigiScore(score) {
    const container = document.getElementById('vault-score-container');
    if (!container) return;

    const threat = HELPERS.getThreatLevel(score);

    container.innerHTML = `
        <div class="score-card">
            <h2 class="section-title">Your Security Rating</h2>
            <div class="score-display">
                <div class="score-circle ${threat.class}">
                    <span id="score-value">0</span>
                    <span class="score-max">/100</span>
                </div>
                <div class="threat-badge ${threat.class}">${threat.label}</div>
            </div>
            <p class="score-description">
                Your <strong>DigiScore</strong> is calculated based on ${score === 100 ? 'zero' : 'detected'} 
                data breaches, profile visibility, and data broker records.
            </p>
        </div>
    `;

    // Animate the score counting up
    animateScore(score);
}

/**
 * Animates the score value from 0 to final.
 * @param {number} finalScore 
 */
function animateScore(finalScore) {
    const scoreElement = document.getElementById('score-value');
    let currentScore = 0;
    const duration = 1500; // 1.5 seconds
    const start = performance.now();

    function update(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        currentScore = Math.floor(progress * finalScore);
        scoreElement.textContent = currentScore;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
