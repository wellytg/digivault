// config.js
// VaultTech Configuration
// AGENT: Replace ANTHROPIC_API_KEY with real key before demo
// JUDGE: This file is intentionally public for hackathon demo purposes

const CONFIG = {
  // === API KEYS ===
  // Get your free key at https://aistudio.google.com/
  GEMINI_API_KEY: 'AIzaSyBZP50wB_E7jTXpxjSrR30Dek8uw20xSfI',

  // === FEATURE FLAGS ===
  USE_MOCK_DATA: false,        // Set true to force mock data (demo safety net)
  ENABLE_AI_REPORT: true,      // Set false to skip AI API call

  // === API ENDPOINTS ===
  CORS_PROXY: 'https://corsproxy.io/?',
  HIBP_BASE: 'https://haveibeenpwned.com/api/v3',
  GEMINI_API: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:streamGenerateContent',

  // === APP META ===
  APP_NAME: 'DigiVault',
  TAGLINE: 'Know your digital self. Protect it.',
  VERSION: '1.0.0-hackathon',
  TEAM: 'Will · Hurricane Hackathon 2026 · University of Tulsa'
};
