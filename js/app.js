/**
 * app.js
 * Main controller for DigiVault. Orchestrates the scan flow and UI transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
    const scanForm = document.getElementById('scan-form');
    if (scanForm) {
        scanForm.addEventListener('submit', handleScan);
    }
});

/**
 * Main scan orchestration function.
 * @param {Event} e 
 */
async function handleScan(e) {
    e.preventDefault();

    const name = document.getElementById('input-name').value.trim();
    const email = document.getElementById('input-email').value.trim();

    const handles = {
        linkedin: document.getElementById('handle-linkedin').value.trim(),
        twitter: document.getElementById('handle-twitter').value.trim(),
        instagram: document.getElementById('handle-instagram').value.trim()
    };

    if (!name || !email) {
        alert("Please enter both your name and email to start the DigiScan.");
        return;
    }

    // UI Transition: Hide landing, show scanning
    transitionUI('landing', 'scanning');

    try {
        // Step 1: Recon (Public profile links)
        updateScanStatus('Scanning public profiles and records...');
        const reconResults = await runRecon(name, handles);
        await delay(800); // Aesthetic delay for "realism"

        // Step 2: Breach check (HIBP API)
        updateScanStatus('Checking global breach databases...');
        const breachResults = await runBreachCheck(email);
        await delay(800);

        // Step 3: DigiScore Calculation
        updateScanStatus('Calculating your DigiScore threat level...');
        const score = calculateDigiScore(reconResults, breachResults);
        await delay(500);

        // Step 4: Render results
        updateScanStatus('Compiling security report...');
        renderRecon(reconResults);
        renderBreachReport(breachResults);
        renderDigiScore(score);

        // UI Transition: Hide scanning, show results
        transitionUI('scanning', 'results');

        // Step 5: AI Recommendations (Streams in after results show)
        if (CONFIG.ENABLE_AI_REPORT) {
            await streamAIReport(name, email, reconResults, breachResults, score);
        }

    } catch (error) {
        console.error("Scan failed:", error);
        alert("An error occurred during the scan. Please try again.");
        transitionUI('scanning', 'landing');
    }
}

/**
 * Transition UI sections by toggling 'hidden' attribute.
 * @param {string} hideId 
 * @param {string} showId 
 */
function transitionUI(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);

    if (hideEl) hideEl.hidden = true;
    if (showEl) {
        showEl.hidden = false;
        showEl.classList.add('fade-in');
    }
}

/**
 * Update the status text shown during the scanning phase.
 * @param {string} status 
 */
function updateScanStatus(status) {
    const statusEl = document.getElementById('scan-status');
    if (statusEl) {
        statusEl.textContent = status;
    }
}

/**
 * Helper to create artificial delays for hackathon demo feel.
 * @param {number} ms 
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
