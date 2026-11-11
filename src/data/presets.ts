import { PresetScenario } from '../types';

export const PRESETS: PresetScenario[] = [
  {
    id: 'kaizen-investigation',
    title: 'Kaizen Investigation (From Reference)',
    kicker: 'NATIONAL COMPOSER',
    headline: 'cost of accountability whispers: "Kaizen"',
    backgroundArticles: [
      "Sources close to the matter described it as a misunderstanding. Sources say it was pending review for months before being brought forward. Nobody resigned, which surprised everyone: most officials declined to make any statement.",
      "City council voted 4-3 to table the inquiry. One member branded the situation 'not ideal' and left. A pigeon was involved in disrupting the final reading.",
      "Over four hundred people filed complaints. One received a reply: 'We are looking into it.' He returned the money. Most of it. Everyone involved has been there for years. Nobody noticed until now.",
      "The leaked ledger confirmed recurring transactions under disguised ledger entries. When questioned yesterday, representatives offered no clarification on the origin of the discrepancies."
    ],
    duration: 4.6,
    timings: [
      { id: 'w1', word: 'cost', start: 0.40, end: 0.85 },
      { id: 'w2', word: 'of', start: 0.90, end: 1.20 },
      { id: 'w3', word: 'accountability', start: 1.25, end: 2.30 },
      { id: 'w4', word: 'whispers:', start: 2.40, end: 3.20 },
      { id: 'w5', word: '"Kaizen"', start: 3.25, end: 4.40, highlightColor: '#FFE817' },
    ],
    highlightColor: '#FFE817', // Bright fluorescent yellow as in screenshot
    style: 'marker',
    soundEffect: 'paper-shuffle',
    paperTheme: 'vintage-aged',
  },
  {
    id: 'midnight-dispatch',
    title: 'Midnight Telegram Dispatch',
    kicker: 'SPECIAL DISPATCH',
    headline: 'classified cables expose secret midnight convoy',
    backgroundArticles: [
      "The telegram was deciphered at 03:00 hours by code officers stationed at the northern outpost. Initial reports indicated heavy vehicular movement along Route 9.",
      "Department officials denied prior knowledge of the shipment, citing administrative oversight. Independent observers confirmed cargo crates bearing federal seals.",
      "Local authorities cordoned off the rail junction for six consecutive hours while unmarked carriers transferred contents onto awaiting flatbed carriages."
    ],
    duration: 4.8,
    timings: [
      { id: 'm1', word: 'classified', start: 0.35, end: 1.05 },
      { id: 'm2', word: 'cables', start: 1.10, end: 1.65 },
      { id: 'm3', word: 'expose', start: 1.70, end: 2.35 },
      { id: 'm4', word: 'secret', start: 2.40, end: 3.05 },
      { id: 'm5', word: 'midnight', start: 3.10, end: 3.80 },
      { id: 'm6', word: 'convoy', start: 3.85, end: 4.60, highlightColor: '#00F0FF' },
    ],
    highlightColor: '#00F0FF', // Electric cyan
    style: 'marker',
    soundEffect: 'typewriter',
    paperTheme: 'tabloid-cream',
  },
  {
    id: 'black-budget',
    title: 'Archive Leaks: Missing Ledger',
    kicker: 'ARCHIVAL LEAKS',
    headline: 'unmarked offshore ledger traced to boardroom summit',
    backgroundArticles: [
      "Financial auditors identified sixteen shell corporations registered under identical PO boxes in Zurich. Wire transfers accelerated in late November.",
      "The board declined comment ahead of the annual shareholder conference. Several executives sold substantial stock tranches prior to the public disclosure."
    ],
    duration: 4.9,
    timings: [
      { id: 'b1', word: 'unmarked', start: 0.30, end: 0.95 },
      { id: 'b2', word: 'offshore', start: 1.00, end: 1.60 },
      { id: 'b3', word: 'ledger', start: 1.65, end: 2.25 },
      { id: 'b4', word: 'traced', start: 2.30, end: 2.85 },
      { id: 'b5', word: 'to', start: 2.90, end: 3.20 },
      { id: 'b6', word: 'boardroom', start: 3.25, end: 4.00 },
      { id: 'b7', word: 'summit', start: 4.05, end: 4.70, highlightColor: '#FF3B30' },
    ],
    highlightColor: '#FF3B30', // Crimson editorial pen
    style: 'red-pen',
    soundEffect: 'marker-squeak',
    paperTheme: 'sepia-archive',
  },
  {
    id: 'ransom-tabloid',
    title: 'Tabloid Cutout: Ransom Headline',
    kicker: 'FRONT PAGE EXCLUSIVE',
    headline: 'witness denies seeing mystery briefcase',
    backgroundArticles: [
      "Eyewitness claims the suspect walked calmly past the lobby security turnstile carrying a leather attache case marked with embossed initials.",
      "Police detectives arrived twenty minutes after the panic alarm was pressed. The vault door remained unlocked without any sign of forced entry."
    ],
    duration: 4.2,
    timings: [
      { id: 'r1', word: 'witness', start: 0.30, end: 0.90 },
      { id: 'r2', word: 'denies', start: 0.95, end: 1.50 },
      { id: 'r3', word: 'seeing', start: 1.55, end: 2.15 },
      { id: 'r4', word: 'mystery', start: 2.20, end: 3.00 },
      { id: 'r5', word: 'briefcase', start: 3.05, end: 4.00 },
    ],
    highlightColor: '#FFE817',
    style: 'cutout',
    soundEffect: 'paper-shuffle',
    paperTheme: 'darkroom-noir',
  }
];
