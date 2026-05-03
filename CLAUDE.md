# DigiVault — Agent Context
> Read this before every session. This is the source of truth.

## Stack
Vanilla JS, HTML5, CSS3. No frameworks. No bundler. No npm. No build step.
GitHub Pages static deploy. index.html opens directly in browser.

## Read First (in this order)
1. CLAUDE.md (this file)
2. .docs/master-plan.md — primary brief and 14-file build order
3. .docs/technical-architecture.md — every function, API call, and code spec

## Brand
- Product name: DigiVault
- Score system: DigiScore
- Scan action: DigiScan  
- Agent (V3 roadmap): DigiAgent
- Tagline: "Know your digital self. Protect it."
- Colour: #00ff88 (DigiVault green)

## Design System
- Background: #0a0a0f
- Surface: #111118
- Border: #1e1e2e
- Accent/LOW: #00ff88
- Warning/MEDIUM: #ffaa00
- Danger/HIGH: #ff4444
- Critical: #ff0055
- Text: #e0e0f0
- Fonts: Space Mono (display) + DM Sans (body) via Google Fonts CDN

## File Build Order (if starting or resuming)
1. config.js
2. js/utils/helpers.js
3. js/utils/api.js
4. js/modules/recon.js
5. js/modules/breach.js
6. js/modules/vault-score.js
7. js/modules/ai-report.js
8. js/app.js
9. css/main.css
10. css/vault-score.css
11. css/animations.css
12. index.html
13. data/mock-results.json
14. README.md

## Key Rules
- config.js must load first — all modules reference global CONFIG object
- Mock data must work completely offline (USE_MOCK_DATA: true in config.js)
- CORS proxy: https://corsproxy.io/? prefixed to HIBP URL
- Claude API header required: 'anthropic-dangerous-direct-browser-access': 'true'
- Never use sudo, never create package.json, never run npm install
- .docs/ and .thinking/ folders are documentation — do not delete or modify

## Current Repo State (as of last audit)
- index.html: ✅ correct
- css/: ✅ built
- js/: ✅ built  
- data/: ✅ built
- config.js: ✅ present (API key placeholder needs replacing before demo)
- .docs/: ⚠ may be missing — check and flag if absent
- .thinking/: ⚠ may be missing — check and flag if absent
- PROJECT_STATUS.md: corrected this session
- _manifest.md: corrected this session
- CLAUDE.md: created this session
- .gitignore: created this session

## Good Ideas from Agent to Merge
Review .context.md and _manifest.md for any features, improvements, or ideas the agent generated that are consistent with the vanilla JS stack and MVP scope. If useful, log them in .thinking/ideas-parking-lot.md under a section called "## Agent-Generated Ideas". Do not implement them now — park them.

## Team
Built by Will · DigiVault · Hurricane Hackathon 2026 · University of Tulsa
ANTHROPIC_API_KEY lives in config.js — never commit a real key.
