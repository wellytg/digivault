# VaultTech — API Reference

---

## HaveIBeenPwned (HIBP)

**Endpoint:** GET `https://haveibeenpwned.com/api/v3/breachedaccount/{account}`

**Free tier:** No API key required for basic breach check
**CORS:** Blocked from browser — use corsproxy.io prefix

**With CORS proxy:**
```
GET https://corsproxy.io/?https://haveibeenpwned.com/api/v3/breachedaccount/email@example.com
```

**Responses:**
- 200: Array of breach objects (breaches found)
- 404: No breaches found (good result)
- 429: Rate limited — fall back to mock data

**Breach object fields used:**
- Name (string): Breach name e.g. "LinkedIn"
- Domain (string): e.g. "linkedin.com"
- BreachDate (string): ISO date
- Description (string): Human readable description
- DataClasses (array): e.g. ["Email addresses", "Passwords"]

---

## Anthropic Claude API

**Endpoint:** POST `https://api.anthropic.com/v1/messages`

**Required headers:**
```
Content-Type: application/json
x-api-key: YOUR_KEY (from config.js)
anthropic-version: 2023-06-01
anthropic-dangerous-direct-browser-access: true
```

**Note:** The `anthropic-dangerous-direct-browser-access: true` header is REQUIRED for browser-based calls. Without it, the API will reject the request.

**Model:** `claude-sonnet-4-20250514`

**Streaming:** Set `"stream": true` in body, handle SSE response

**SSE parsing for streaming:**
```javascript
const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value);
  const lines = buffer.split('\n');
  buffer = lines.pop();
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'content_block_delta') {
          const text = parsed.delta?.text || '';
          appendToOutput(text); // stream into DOM
        }
      } catch (e) {}
    }
  }
}
```

---

## Google Search (no API — constructed URLs only)

**General search:** `https://google.com/search?q="FULL+NAME"`
**News:** `https://news.google.com/search?q=FULL+NAME`
**Images:** `https://google.com/search?q="FULL+NAME"&tbm=isch`

No API key needed — these are just URL links for user to click.

---

## corsproxy.io

**Free CORS proxy:** Prefix any URL with `https://corsproxy.io/?`

No API key, no account needed for hackathon use.
Rate limited under heavy use — mock fallback handles this.
