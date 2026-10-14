// DELAKLEAN site behaviour: mobile nav toggle + "open chat" buttons.
// Loaded via <script src="/site.js" defer>. No inline handlers (CSP).
(() => {
  "use strict";

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Any element with data-open-chat opens the DELAKLEAN widget if it is loaded.
  document.querySelectorAll("[data-open-chat]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const bubble = document.getElementById("dk-bubble");
      if (bubble) {
        e.preventDefault();
        bubble.click();
        const input = document.getElementById("dk-input");
        if (input) input.focus();
      }
      // If the widget is not present, the link falls through to its href (WhatsApp).
    });
  });
})();
