import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface GenerateVideoOptions {
  word: string;
  aspectRatio?: '1:1' | '9:16' | '16:9';
  sound?: string;
  format?: 'mp4' | 'webm';
}

export async function generateMatchCutVideo(options: GenerateVideoOptions): Promise<{
  success: boolean;
  videoUrl: string;
  filename: string;
  word: string;
  aspectRatio: string;
}> {
  const rawWord = options.word.trim() || 'Heaven';
  // Keep only alphanumeric and clean punctuation, trim to 23 chars
  const cleanWord = rawWord.replace(/[^a-zA-Z0-9 _-]/g, '').slice(0, 23);
  const slug = cleanWord.toLowerCase().replace(/\s+/g, '_') || 'custom';
  const aspect = options.aspectRatio || '1:1';
  const sound = options.sound || 'Paper shuffle';
  const isMuted = sound.toLowerCase().includes('mute') || sound.toLowerCase().includes('none');

  const outDir = path.resolve(process.cwd(), 'public/generated');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Base authentic reference video provided by the user (368x368)
  const referenceVideoPath = path.resolve(
    process.cwd(),
    'public/assets/aistudio/VID-20261109-WA0001_2aec6ebf.mp4'
  );

  // If the word is "Heaven" and 1:1, return the untouched reference video
  if (cleanWord.toLowerCase() === 'heaven' && aspect === '1:1' && !isMuted) {
    return {
      success: true,
      videoUrl: '/assets/aistudio/VID-20261109-WA0001_2aec6ebf.mp4',
      filename: 'match_cut_heaven.mp4',
      word: 'Heaven',
      aspectRatio: '1:1',
    };
  }

  const filename = `match_cut_${slug}_${aspect.replace(':', '_')}_v3.mp4`;
  const outPath = path.join(outDir, filename);
  const publicUrl = `/generated/${filename}`;

  // If already generated and valid, return cached file
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
    return {
      success: true,
      videoUrl: publicUrl,
      filename,
      word: cleanWord,
      aspectRatio: aspect,
    };
  }

  // Font matching User Image 2: classical regular newspaper editorial serif
  const fontFile = '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf';

  // Exact character widths in LiberationSerif-Regular at 23px for proportional typesetting
  const CHAR_WIDTHS: Record<string, number> = {
    '0': 11, '1': 10, '2': 10, '3': 11, '4': 11, '5': 11, '6': 11, '7': 11, '8': 11, '9': 11,
    'a': 10, 'b': 11, 'c': 9, 'd': 11, 'e': 9, 'f': 8, 'g': 11, 'h': 11, 'i': 6, 'j': 4,
    'k': 11, 'l': 6, 'm': 17, 'n': 11, 'o': 11, 'p': 11, 'q': 11, 'r': 7, 's': 8, 't': 6,
    'u': 11, 'v': 11, 'w': 16, 'x': 11, 'y': 11, 'z': 10,
    'A': 16, 'B': 14, 'C': 14, 'D': 16, 'E': 13, 'F': 12, 'G': 16, 'H': 16, 'I': 7, 'J': 8,
    'K': 16, 'L': 13, 'M': 20, 'N': 16, 'O': 16, 'P': 12, 'Q': 16, 'R': 15, 'S': 11, 'T': 14,
    'U': 16, 'V': 16, 'W': 21, 'X': 16, 'Y': 16, 'Z': 13,
    ' ': 6, '-': 7, '_': 12,
  };

  // Dynamic font sizing based on word length so words fit gracefully
  const len = cleanWord.length;
  let fontSize = 23;
  if (len <= 4) {
    fontSize = 24;
  } else if (len <= 7) {
    fontSize = 23;
  } else if (len <= 10) {
    fontSize = 20;
  } else if (len <= 14) {
    fontSize = 17;
  } else {
    fontSize = 14;
  }

  // Calculate proportional width of the focal word
  let rawWidth = 0;
  for (const ch of cleanWord) {
    rawWidth += CHAR_WIDTHS[ch] || 11;
  }
  const wordWidth = Math.round(rawWidth * (fontSize / 23));

  // Match cuts with exact verified timestamps, paper background colors, and following text
  const cuts = [
    { start: 0.000, end: 0.107, paper: '0xf0ebe6' },
    { start: 0.107, end: 0.746, paper: '0xe9e7da', following: 'routine”', followingEnd: 330 },
    { start: 0.746, end: 1.081, paper: '0xcfccc5' },
    { start: 1.081, end: 1.179, paper: '0xa6a39e' },
    { start: 1.179, end: 1.271, paper: '0xc1c0bd' },
    { start: 1.271, end: 1.373, paper: '0xc1c2bd' },
    { start: 1.373, end: 1.526, paper: '0xf2ede6', following: 'quiet,', followingEnd: 310 },
    { start: 1.526, end: 1.624, paper: '0xdcd8d5' },
    { start: 1.624, end: 1.670, paper: '0xf6f5ec' },
    { start: 1.670, end: 1.772, paper: '0xf6f5ec', following: 'kept', followingEnd: 295 },
    { start: 1.772, end: 1.873, paper: '0xf0ecea' },
    { start: 1.873, end: 1.989, paper: '0xf4f4ed', following: 'be quoted', followingEnd: 335 },
    { start: 1.989, end: 2.072, paper: '0xf6f2ef' },
    { start: 2.072, end: 2.162, paper: '0xf8f3ee', following: 'called it', followingEnd: 350 }, // Authentic "The Chairman" cut
    { start: 2.162, end: 2.270, paper: '0xe6e1dc' },
    { start: 2.270, end: 2.383, paper: '0xf5f0ec' },
    { start: 2.383, end: 2.454, paper: '0xefeee2' },
    { start: 2.454, end: 2.772, paper: '0xf0ebe6' },
    { start: 2.772, end: 3.003, paper: '0xe6e5db' },
    { start: 3.003, end: 3.171, paper: '0xefeae1', following: 'in 2019”', followingEnd: 335 },
    { start: 3.171, end: 3.264, paper: '0xf2f1ed' },
    { start: 3.264, end: 3.362, paper: '0xf2f0eb' },
    { start: 3.362, end: 3.479, paper: '0x9e9995' },
    { start: 3.479, end: 3.575, paper: '0xedeee3' },
    { start: 3.575, end: 3.702, paper: '0x919188' },
    { start: 3.702, end: 3.769, paper: '0xf5f3f0' },
    { start: 3.769, end: 3.874, paper: '0x87837a' },
    { start: 3.874, end: 3.975, paper: '0xa19c96' },
    { start: 3.975, end: 4.065, paper: '0xf4f2ee', following: 'for work', followingEnd: 330 },
    { start: 4.065, end: 4.170, paper: '0xf4f2ef' },
    { start: 4.170, end: 5.370, paper: '0xeae8e3', following: 'resigned.', followingEnd: 330 },
  ];

  // Filter chain:
  // 1. Wipe the old yellow box (and old following text if being repositioned) with exact paper fill
  //    (Ensures ZERO residual faint yellow color outside the word)
  // 2. drawtext with box=1:boxcolor=0xf5e55b dynamically highlights ONLY the exact width of the user's word
  // 3. Continuation text follows immediately after the focal word with natural grammatical spacing (no gap)
  const filters: string[] = [];

  for (const c of cuts) {
    const tEn = `between(t,${c.start},${c.end})`;
    const wipeW = c.following && c.followingEnd ? c.followingEnd - 132 : 106;

    // 1. Clean paper wipe matching this cut
    filters.push(`drawbox=x=132:y=169:w=${wipeW}:h=31:color=${c.paper}:t=fill:enable='${tEn}'`);

    // 2. Focal word with yellow highlight strictly hugging the word length
    filters.push(
      `drawtext=fontfile=${fontFile}:text='${cleanWord}':fontsize=${fontSize}:fontcolor=0x1c1b18:` +
        `box=1:boxcolor=0xf5e55b:boxborderw=4:x=136:y=173:enable='${tEn}'`
    );

    // 3. Continuation text naturally following without awkward space gap
    if (c.following) {
      // 136 + wordWidth + 4 (box border) + 10 (natural word space gap)
      const nextX = 136 + wordWidth + 14;
      const escapedFollowing = c.following.replace(/'/g, "'\\\\''");
      filters.push(
        `drawtext=fontfile=${fontFile}:text='${escapedFollowing}':fontsize=${fontSize}:fontcolor=0x1c1b18:` +
          `x=${nextX}:y=173:enable='${tEn}'`
      );
    }
  }

  // Handle aspect ratios:
  // 1:1: scale to 720x720 so it fills any square container crisply with zero black bars!
  // 9:16: scale to 720x1280 with soft paper margins for vertical feed
  // 16:9: scale to 1280x720 with soft paper margins for widescreen feed
  if (aspect === '1:1') {
    filters.push('scale=720:720');
  } else if (aspect === '9:16') {
    filters.push('scale=720:720,pad=720:1280:0:(1280-720)/2:0xf5ede0');
  } else if (aspect === '16:9') {
    filters.push('scale=720:720,pad=1280:720:(1280-720)/2:0:0xf5ede0');
  }

  const vf = filters.join(',');

  return new Promise((resolve) => {
    const args = [
      '-y',
      '-i',
      referenceVideoPath,
      '-vf',
      vf,
      '-c:v',
      'libx264',
      '-preset',
      'ultrafast',
      '-pix_fmt',
      'yuv420p',
    ];

    if (isMuted) {
      args.push('-an');
    } else {
      args.push('-c:a', 'copy');
    }

    args.push('-movflags', '+faststart', outPath);

    const child = spawn('ffmpeg', args);

    child.on('close', (code) => {
      if (code === 0 && fs.existsSync(outPath)) {
        resolve({
          success: true,
          videoUrl: publicUrl,
          filename,
          word: cleanWord,
          aspectRatio: aspect,
        });
      } else {
        resolve({
          success: false,
          videoUrl: '/assets/aistudio/VID-20261109-WA0001_2aec6ebf.mp4',
          filename: 'match_cut.mp4',
          word: cleanWord,
          aspectRatio: aspect,
        });
      }
    });

    child.on('error', (err) => {
      console.error('ffmpeg process error:', err);
      resolve({
        success: false,
        videoUrl: '/assets/aistudio/VID-20261109-WA0001_2aec6ebf.mp4',
        filename: 'match_cut.mp4',
        word: cleanWord,
        aspectRatio: aspect,
      });
    });
  });
}
