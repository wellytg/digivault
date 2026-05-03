// config.js
// VaultTech Configuration
// AGENT: Replace ANTHROPIC_API_KEY with real key before demo
// JUDGE: This file is intentionally public for hackathon demo purposes

const CONFIG = {
  // === API KEYS ===
  ANTHROPIC_API_KEY: 'YOUR_ANTHROPIC_API_KEY_HERE',

  // === FEATURE FLAGS ===
  USE_MOCK_DATA: false,        // Set true to force mock data (demo safety net)
  ENABLE_AI_REPORT: true,      // Set false to skip Claude API call

  // === API ENDPOINTS ===
  CORS_PROXY: 'https://corsproxy.io/?',
  HIBP_BASE: 'https://haveibeenpwned.com/api/v3',
  ANTHROPIC_API: 'https://api.anthropic.com/v1/messages',
  CLAUDE_MODEL: 'claude-sonnet-4-20250514',

  // === APP META ===
  APP_NAME: 'DigiVault',
  TAGLINE: 'Know your digital self. Protect it.',
  VERSION: '1.0.0-hackathon',
  TEAM: 'Will · Hurricane Hackathon 2026 · University of Tulsa'
};
