# ETHERCAT / $ECAT — The Cat Who Accidentally Became King

## Creative direction
One single scrolling page, conceived as a journey through a cat's increasingly ridiculous kingdom. Premium illustrated fantasy meets very ordinary cat behavior. Indigo #100B2C, amethyst #8B42F5, moonlight #EDE6FF, silver #BAC2DA. Use silver display serif headlines and readable sans-serif body copy; keep website text in HTML. Use the supplied branded images only where raster text is appropriate.

## 1. The forbidden glowing thing — hero
Headline: Ethereum found its cat.
Subhead: He came for the shiny thing. He stayed because everyone called him Your Majesty.
Actions: Enter the kingdom (scroll to story); Join the court (official Telegram link, only once supplied).
Use ecat-hero-kingdom.png as environment, ecat-mascot-cutout.png as independent foreground. A slowly orbiting diamond reacts gently to pointer position. Scroll opens a portal into chapter one. Never trap scrolling or hide navigation. Fixed links: The Accident, Royal Affairs, The Vault, Enter the Court.

## 2. The box was already a palace — chapter one
Ethercat had everything a cat could want: three expensive beds he refused to touch, a water fountain he considered suspicious, and a cardboard box with excellent structural integrity. His human called it packaging. Ethercat called it ancestral property.

One evening a little purple diamond appeared under the sofa. It glowed. It floated. It made a faint humming noise. Naturally, Ethercat concluded that it was a toy and that somebody else should be blamed for whatever happened next.

He tapped it once. The lights flickered. He tapped it twice. A hole opened in reality. He tapped it a third time because cats do not read warning labels, especially labels written in the fabric of spacetime.

Interaction: a visible button labeled Tap the shiny thing advances a three-step visual effect. Scrolling also proceeds normally. Use ecat-story-01-box.png. No mandatory game gate.

## 3. One small pounce, one enormous administrative problem — chapter two
The diamond escaped through a violet doorway. Ethercat followed with the confidence of a creature who had never paid rent. A sock, two receipts, and his favorite box followed behind him. The laws of physics submitted a complaint.

On the other side lay floating castles, crystal waterfalls, and a moon so large it looked like somebody had forgotten to resize it. In the center stood a throne. Ethercat sat on it immediately. This was interpreted as a coronation.

He attempted to explain that he was only looking for the shiny thing. Unfortunately, his explanation sounded like meow, which the ancient royal council translated as a bold new constitutional vision.

Interaction: use ecat-story-02-portal.png in a diagonal portal reveal with normal document flow; provide static reduced-motion version. Floating socks can be lightweight CSS shapes or optional simple SVGs, not extra raster images.

## 4. His Majesty is unavailable — chapter three
The kingdom presented its urgent affairs. A bridge needed repairing. A dragon had parked illegally. Someone wanted a committee to investigate the previous committee. Ethercat knocked the documents off the table and went to sleep.

The court called it decisive leadership.

His first decree required every sunbeam to be available for public napping. His second abolished closed doors. His third demanded that all empty bowls be treated as national emergencies, even if they had been filled eleven minutes earlier.

He was offered a crown. He wore it for four seconds, attacked its reflection, and pushed it into a fountain. The crown is now considered a sacred underwater relic.

By sunset, Ethercat had achieved what generations of rulers could not: every citizen was discussing the same thing. Was the king a genius, or just a cat? Ethercat declined to comment because a moth had entered the room.

Interaction: ecat-story-03-throne.png as a large tilted story card. Clickable decree tabs reveal short jokes. The story stays readable without interaction.

## 5. The royal vault — transparent token information
Use ecat-treasury.png, four responsive HTML stat plaques, never bake numbers into scene.
Royal inventory: 1,000,000,000 $ECAT total supply.
The king's cut: 0% token tax.
The permanent foundation: LP burn planned at launch.
The empty throne of control: ownership renunciation planned at launch.
Status: These are planned settings until deployment and on-chain evidence confirm them. Keep LP and ownership status configurable and show transaction evidence when available. Do not imply these settings guarantee safety.
CA: Coming Soon.. Disable copy and purchase actions while no valid Ethereum contract address exists.

## 6. Crossing into the kingdom — clearly understandable buying steps
1. Pack your wallet: create or open an Ethereum-compatible wallet.
2. Bring ETH: fund Ethereum mainnet, keeping ETH for network fees.
3. Check the royal seal: verify the contract through official project channels.
4. Make the swap: open the configured official swap link and review the transaction.
Use four HTML step cards with small CSS/SVG paw/diamond illustrations; no wallet connection required for this informational website. No fabricated swap link.

## 7. The royal expressions department — meme drawer
Six supplied reactions: smug, shocked, laughing, angry, tired, loving. Captions remain editable HTML outside artwork:
Smug: I meant to do that.
Shocked: THE BOWL IS EMPTY.
Laughing: They gave the cat paperwork.
Angry: Who closed this door?
Tired: Another meeting that could have been a nap.
Loving: Mine. All mine.
Click opens accessible lightbox with download button. Support keyboard navigation, visible focus, alt text, and touch swipe optionally. Use provided PNG files directly. Do not pretend these still images are animations.

## 8. Enter the court — community finale
Use ecat-community.png. Heading: Every kingdom needs questionable company.
Copy: Bring your memes. Bring your cat pictures. Leave the royal paperwork to absolutely nobody.
Official Telegram and X buttons only after URLs supplied. Footer: Ethercat is an independent meme project on Ethereum. No affiliation with the Ethereum Foundation or the referenced Catcoin project is implied. Memecoin prices are volatile; no returns are promised.

## Build rules
Inspect existing repository instructions, stack, scripts and assets first; preserve established stack. Single page, real scroll anchors, mobile navigation, lazy-loaded below-fold scenes. Do not use full screenshots as the website. Background art is decoration; content, links, cards and controls are real HTML. Keep text contrast high with dark scrims. Use only subtle transforms on mobile, avoid autoplay sound, honor prefers-reduced-motion, avoid long pinned sections and giant WebGL dependencies. No fake holders, fabricated volume, price tickers, countdowns or claims of existing community scale.
