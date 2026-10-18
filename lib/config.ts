export const asset = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/${path}`;
export const token = {
  name: "Ethercat",
  ticker: "ECAT",
  supply: "1,000,000,000",
  tax: "0%",
  chainId: 1,
  contractAddress: "",
  telegram: "https://t.me/ethercat_ecat",
  x: "https://x.com/ethercat_ecat",
  swap: "",
  lp: { status: "Planned", evidence: "" },
  ownership: { status: "Planned", evidence: "" },
};
export function officialUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
export const memes = [
  {
    id: "01-smug",
    title: "Royal smirk.",
    caption: "I meant to do that.",
    category: "royal",
  },
  {
    id: "02-shocked",
    title: "Absolutely shocked.",
    caption: "THE BOWL IS EMPTY.",
    category: "bowl",
  },
  {
    id: "03-laughing",
    title: "Royal laughter.",
    caption: "They gave the cat paperwork.",
    category: "royal",
  },
  {
    id: "04-angry",
    title: "Slightly furious.",
    caption: "Who closed this door?",
    category: "royal",
  },
  {
    id: "05-tired",
    title: "Mentally offline.",
    caption: "Another meeting that could have been a nap.",
    category: "royal",
  },
  {
    id: "06-loving",
    title: "All the love.",
    caption: "Mine. All mine.",
    category: "royal",
  },
];
