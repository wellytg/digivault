# VaultTech — Ideas Parking Lot
> Good ideas that didn't make the 24hr cut. V2 fodder.

---

## Parked Features

### VaultAgent
AI agent that monitors your digital presence continuously. Alerts you to new breaches, new mentions, new profiles created with your name. The core long-term vision.
**Why parked:** Requires backend, persistent storage, scheduled jobs
**Target:** V3

### Profile Sync
Help users make their bio, photo, and key info consistent across LinkedIn, Twitter, and personal site. Show a "consistency score" alongside VaultScore.
**Why parked:** Requires OAuth for each platform
**Target:** V2

### Continuous Monitoring Mode
Enter your email once, check back weekly for new breaches. Store in localStorage.
**Why parked:** Scope — localStorage + polling is doable but adds complexity
**Target:** V1.5 (post-hackathon quick win)

### Deep Scan Mode
Beyond HIBP — check Pastebin dumps, dark web mentions via public APIs, reverse image search.
**Why parked:** Requires paid APIs
**Target:** VaultPro tier

### Social Graph Analysis
Given a name, map connections to identify second-degree exposure (if your friend is breached with your shared data).
**Why parked:** Graph data not publicly accessible
**Target:** Research phase

### Browser Extension
Real-time alerts when you visit a site that has been breached.
**Why parked:** Separate product
**Target:** V4

---

## Design Ideas (Unused)

- Animated world map showing where breached data has been accessed from
- "Digital twin" avatar that visually degrades as exposure increases
- Timeline view: your digital footprint by year

---

## Agent-Generated Ideas (Parked)

### UI/UX & Quality of Life
- **Dark Mode / Light Mode Toggle:** Use CSS variables to easily switch between "Stealth" and "Clear" themes.
- **Visual Exposure Map:** A world map showing where breach data might have originated or where profile visibility is highest.
- **Export to PDF:** A "Security Audit" download button to save the DigiScan report locally.
- **Local History:** Use `localStorage` to keep a record of previous scans (private to the user's browser).
- **DigiVault Browser Extension:** A companion tool that alerts users when they visit a site known for high data broker activity.
