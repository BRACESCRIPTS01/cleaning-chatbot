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
