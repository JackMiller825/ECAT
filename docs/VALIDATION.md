# Validation

- Next.js 16.4.2 production build (webpack): passed after the dashboard and court updates.
- Strict TypeScript check: passed.
- Static homepage export: passed.
- Browser comparison against the seven design-reference previews: completed at 1440px, with overflow checks at 1280, 768, 390, and 320.
- Exercised crystal taps and reset, decree arrow/End keys, meme filters, lightbox next/close, and focus return to the opener.
- Reduced motion removes mascot float and portal rotation while the story, controls, and artwork stay in place.
- Contract copy stays disabled and the address reads Coming Soon.. Telegram, X, and swap stay unavailable until HTTPS URLs are added in lib/config.ts.
- `/dashboard` asks for the password and then shows active visitors, uniques, visits, page views, clicks, trend, referrals, campaigns, and visit history. Development traffic is filtered out until included.
- No duplicate element IDs. Anchors home, accident, royal-affairs, throne, vault, entry, gallery, and court all exist. One H1.

The dev-server hydration warning seen during browser inspection came from the inspection tool adding `data-cursor-ref` attributes. It is not an application mismatch.

Remaining launch items are configuration, not layout: a real contract address, Telegram URL, X URL, and swap URL.
