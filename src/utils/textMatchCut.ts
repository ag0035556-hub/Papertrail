import { NewspaperScene } from '../types';

export interface TextMatchCutConfig {
  maxCharacters: number;
  defaultWord: string;
  defaultSentence: string;
}

export const DEFAULT_CONFIG: TextMatchCutConfig = {
  maxCharacters: 23,
  defaultWord: 'Heaven',
  defaultSentence: 'It was not Heaven routine',
};

/**
 * Validates and trims focal text to 23 characters
 */
export function validateFocalText(text: string, maxLen = 23): { isValid: boolean; value: string; charCount: number; remainingChars: number } {
  const trimmed = text.slice(0, maxLen);
  return {
    isValid: trimmed.trim().length > 0,
    value: trimmed,
    charCount: trimmed.length,
    remainingChars: Math.max(0, maxLen - trimmed.length),
  };
}

/**
 * Extracts target focus word from a sentence. If word is provided, checks if it's contained.
 */
export function extractFocalWord(sentence: string, targetWord?: string): string {
  if (targetWord && targetWord.trim()) {
    return targetWord.trim();
  }
  const words = sentence.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'Heaven';

  // Common stop words to skip
  const stopWords = new Set(['it', 'the', 'a', 'an', 'he', 'she', 'was', 'is', 'not', 'in', 'on', 'at', 'to', 'for', 'of', 'and']);

  // Find non-stop capitalized words
  const meaningfulCapital = words.find(
    (w) => /^[A-Z]/.test(w) && !stopWords.has(w.toLowerCase().replace(/[^a-z]/g, ''))
  );
  if (meaningfulCapital) return meaningfulCapital.replace(/[^a-zA-Z0-9]/g, '');

  // Otherwise find longest non-stop word
  const filtered = words.filter((w) => !stopWords.has(w.toLowerCase().replace(/[^a-z]/g, '')));
  if (filtered.length > 0) {
    filtered.sort((a, b) => b.length - a.length);
    return filtered[0].replace(/[^a-zA-Z0-9]/g, '');
  }

  return words[words.length - 1].replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Formats weekly count with commas
 */
export function formatWeeklyCutsCount(count: number): string {
  return `${count.toLocaleString()}+ match cuts generated this week`;
}

/**
 * Generates 5 rapid synchronized newspaper match cuts for ANY word.
 * Timestamps precisely align with the 5.29s audio speech beats and paper snaps.
 */
export function generateMatchCutScenesForWord(rawWord: string): NewspaperScene[] {
  const word = rawWord.trim() || 'Heaven';
  return [
    {
      id: 'cut-1',
      type: 'quote',
      startTime: 0.0,
      endTime: 1.18,
      kicker: 'OFFICIAL STATEMENT',
      headline: `"He described the transaction as routine. It was not ${word} routine"`,
      highlightWord: word,
      highlightColor: '#FFE817',
      rotation: -0.4,
      bodyColumns: [
        'The dog was fine. Nobody had asked about the dog. City council voted 4-3 to table the inquiry.',
        'Sources confirmed the audit was expedited following complaints filed by local residents.',
      ],
    },
    {
      id: 'cut-2',
      type: 'masthead',
      startTime: 1.18,
      endTime: 2.27,
      kicker: 'THE MORNING COURIER',
      headline: `Police confirm ${word}. Decline to elaborate.`,
      subhead: 'Funding was allocated briefly and then not mentioned again.',
      highlightWord: word,
      highlightColor: '#FFE817',
      rotation: 0.5,
      bodyColumns: [
        `A pigeon was briefly detained. Twelve people filed complaints regarding ${word}. One received a reply.`,
        'The statue has been removed to spend more time with investments. Inquiry resumes tomorrow.',
      ],
    },
    {
      id: 'cut-3',
      type: 'macro-column',
      startTime: 2.27,
      endTime: 3.77,
      kicker: 'POLICE LOG & CCTV',
      headline: `sandwiches. CCTV captured nothing on ${word}.`,
      subhead: 'Officers are reviewing the surveillance footage.',
      highlightWord: word,
      highlightColor: '#FFE817',
      rotation: -0.6,
      bodyColumns: [
        `Officers are reviewing the tapes slowly. She blamed her assistant. ${word} has since moved to new offices.`,
        'Nearby residents were surprised, but mostly not shocked. Further statements pending.',
      ],
    },
    {
      id: 'cut-4',
      type: 'desk-report',
      startTime: 3.77,
      endTime: 4.5,
      kicker: 'THE REGIONAL MURMUR',
      desk: 'Crime & Investigation Desk',
      headline: `Mayor denies involvement in ${word}`,
      subhead: `The internal audit found irregularities. ${word} quietly shelved.`,
      highlightWord: word,
      highlightColor: '#FFE817',
      rotation: 0.3,
      bodyColumns: [
        'The suspect was later found at a nearby buffet. It solves nothing. Meeting rescheduled for noon.',
        'Spokesperson smiled and said nothing. Nobody read the full thirty-page dossier.',
      ],
    },
    {
      id: 'cut-5',
      type: 'macro-column',
      startTime: 4.5,
      endTime: 5.29,
      kicker: 'SPECIAL AUDIT',
      headline: `Building has been there for years. ${word} noticed until now.`,
      subhead: 'Nobody noticed until the quarterly review.',
      highlightWord: word,
      highlightColor: '#FFE817',
      rotation: -0.3,
      bodyColumns: [
        `The report is seven pages and solves nothing. Auditor billed for ${word} work invisible to anyone.`,
        'Funding has been reallocated. Current location is unknown. Nobody was charged.',
      ],
    },
  ];
}

/**
 * Returns generation pipeline steps to show realistic progress
 */
export function getGenerationSteps(word: string): string[] {
  return [
    `Searching vintage broadsheet archives for "${word}"...`,
    `Typesetting column layouts and headline print...`,
    `Applying fluorescent yellow highlighter ink to "${word}"...`,
    `Locking audio timestamps to speech cadence...`,
    `Encoding crisp 1080p MP4 without watermark...`,
  ];
}

