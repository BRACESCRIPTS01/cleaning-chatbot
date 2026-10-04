# DELAKLEAN chatbot — drop-in AI assistant for a Lagos cleaning company

A small, production-grade customer assistant: one script tag on any page,
a serverless function in front of Gemini, and a WhatsApp handoff for
anything that needs a human (prices, bookings, complaints).

**Live demo:** https://cleaning-chatbot.netlify.app

## What it does
- Answers questions about services, areas covered and working hours.
- Never quotes prices. Pricing, bookings and out-of-scope requests return
  `handoff: true` and the widget shows a prefilled `wa.me` button.
- Replies in English, switches to Pidgin if the customer writes Pidgin.

## Install on any page

```html
<script src="https://cleaning-chatbot.netlify.app/widget.js" defer></script>
```

That's it. The widget renders a chat bubble, keeps the last 8 turns in
memory, and talks to `/api/chat`.

## How it works

```text
browser widget.js  ->  POST /api/chat (Netlify Function, chat.mjs)
                       |- validate body (JSON, 1-500 chars, <=8 history turns)
                       |- call Gemini with systemInstruction + responseSchema
                       |- parse + type-check {reply, intent, handoff, service}
                       '- return JSON, or FALLBACK (+ WhatsApp) on any failure
```

## Security baseline
- API key lives only in the `CLEANING_GEMINI_KEY` environment variable
  (server side). The browser never sees it.
- Gemini is forced to return schema-validated JSON; `handoff` is a real
  boolean, so the widget never guesses from text.
- Rate limit: 20 requests / 60 s per IP (Netlify `config.rateLimit`).
- Widget builds DOM with `createElement` / `textContent` only — no `innerHTML`.
- `public/_headers`: CSP (`script-src 'self'`, no inline scripts),
  `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`,
  `X-Content-Type-Options: nosniff`.
- Function responses are `Cache-Control: no-store`.
- Upstream failures are logged (status + 200-char body) — never the key.

Audited against: prompt injection, price roleplay, system-prompt leak,
XSS in replies, oversized bodies, poisoned chat history, wrong content-type.
Known accepted risk: client-supplied history is trusted for context only;
no price or payment decision ever derives from it.

## Deploy your own
1. Fork, then create a Netlify project from the repo
   (`publish = public`, `functions = netlify/functions` via `netlify.toml`).
2. Netlify > Environment variables > add `CLEANING_GEMINI_KEY` (secret)
   for Production and Branch deploys.
3. Edit `BUSINESS` in `netlify/functions/chat.mjs` and `FALLBACK_WA` in
   `public/widget.js` with the client's details.
4. Deploy. Verify headers (PowerShell):
   `Invoke-WebRequest -Uri https://YOUR-SITE.netlify.app -UseBasicParsing | Select -ExpandProperty Headers`

## Stack
Plain HTML/CSS/JS · Netlify Functions (modern `.mjs`) · Google Gemini
(`gemini-3.5-flash-lite`, JSON schema output) · no frameworks, no build step.

## Status
Phase 1 (chat + handoff) live. Roadmap: Supabase lead capture, Paystack
deposit webhook (HMAC-verified, idempotent), daily owner digest, n8n variant.
The WhatsApp number in the demo is a placeholder.
