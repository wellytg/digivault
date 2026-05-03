/**
 * ai-report.js
 * Handles the AI-powered security recommendation report using Claude.
 */

/**
 * Generates and streams AI recommendations into the DOM.
 * @param {string} name 
 * @param {string} email 
 * @param {Object} recon 
 * @param {Array} breaches 
 * @param {number} score 
 */
async function streamAIReport(name, email, recon, breaches, score) {
    const container = document.getElementById('ai-recommendations');
    if (!container) return;

    const threat = HELPERS.getThreatLevel(score);

    container.innerHTML = `
        <h2 class="section-title">AI Security Recommendations</h2>
        <div class="ai-report-box">
            <div id="ai-report-content" class="typewriter">Generating personalized report...</div>
        </div>
    `;

    const contentBox = document.getElementById('ai-report-content');
    contentBox.innerHTML = ''; // Clear the "Generating..." message

    const prompt = `You are DigiVault's security AI. Analyse this digital exposure report and provide exactly 5 specific, actionable recommendations.

Subject: ${name}
Email: ${email}
DigiScore: ${score}/100 (${threat.label})
Breaches found: ${breaches.length}
Breach details: ${JSON.stringify(breaches.map(b => ({ name: b.Name, date: b.BreachDate, data: b.DataClasses })))}
Public profiles visibility: ${recon.social.length + recon.search.length} major platforms

Return ONLY a numbered list of 5 recommendations. Be specific, practical, and prioritise by urgency. No preamble.`;

    await API.callClaudeStreaming(prompt, (delta) => {
        contentBox.innerText += delta;
        // Scroll to bottom as it streams
        container.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
}
