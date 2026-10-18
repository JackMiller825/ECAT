# Asset placement and motion

| Section | Asset | Placement | Motion |
|---|---|---|---|
| Entrance | scenes/ecat-hero-kingdom.png | Full-width background, dark headline at left | Background translateY max 24px |
| Entrance | characters/ecat-mascot-cutout.png | Independent right foreground, contain | Gentle float 8px; pointer tilt max 3deg |
| Box chapter | scenes/ecat-story-01-box.png | Large framed landscape, prose beside | Diamond SVG glows when tapped |
| Portal chapter | scenes/ecat-story-02-portal.png | Full-width cinematic interlude | CSS circular clip reveal, optional; static fallback |
| Throne chapter | scenes/ecat-story-03-throne.png | Alternating art and narrative | Decree tabs animate opacity only |
| Vault | scenes/ecat-treasury.png | Decorative full-width background | Four HTML plaques; stagger appearance |
| Buying steps | effects/ecat-paw.svg | Four HTML step cards | Short paw trail on step focus |
| Meme drawer | memes/*.png | Responsive gallery, contain | Accessible lightbox, download |
| Court | scenes/ecat-community.png | Finale scene with HTML CTA panel | Portal ring SVG slow rotation |
| Navigation | brand/ecat-logo-transparent.png | Small logo, descriptive alt | Static |
| Social metadata | brand/ecat-banner.png | Source for social image derivative | None |

Never animate the image's internal eyes or paws by stretching the flattened scene. Only the independent mascot layer supports whole-character transforms. No skeletal animation assets are included. Effects SVGs have transparent canvases and can be recolored in CSS. Keep below-fold scene loading lazy. Main hero loads eagerly. Object-fit: contain for memes and mascot; avoid cropping face, ears or tail. Prefer an inline scene at mobile widths over a heavily cropped background. Reserve width and height to prevent layout shifts. Honor reduced motion by removing float, rotation, tilt and portal reveal. Normal scroll and anchor links must always work.
