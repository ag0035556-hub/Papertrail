import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getActiveWordIndex,
  isWordCompleted,
  getWordProgress,
  formatTime,
  parseTimeToSeconds,
  generateDefaultTimings,
  generateTornEdgePoints,
  WordTiming
} from './newspaperSync';

test('formatTime and parseTimeToSeconds work reciprocally', () => {
  assert.equal(formatTime(0), '00:00.00');
  assert.equal(formatTime(65.4), '01:05.40');
  assert.equal(formatTime(12.75), '00:12.75');

  assert.equal(parseTimeToSeconds('01:05.40'), 65.4);
  assert.equal(parseTimeToSeconds('12.75'), 12.75);
});

test('getActiveWordIndex identifies the correct word by time', () => {
  const words: WordTiming[] = [
    { id: '1', word: 'cost', start: 0.5, end: 1.0 },
    { id: '2', word: 'of', start: 1.1, end: 1.4 },
    { id: '3', word: 'accountability', start: 1.5, end: 2.2 },
    { id: '4', word: 'whispers:', start: 2.3, end: 2.9 },
    { id: '5', word: '"Kaizen"', start: 3.0, end: 4.0 },
  ];

  // Before first word
  assert.equal(getActiveWordIndex(words, 0.2), -1);

  // During first word
  assert.equal(getActiveWordIndex(words, 0.5), 0);
  assert.equal(getActiveWordIndex(words, 0.8), 0);

  // In the gap between words
  assert.equal(getActiveWordIndex(words, 1.05), -1);

  // During word 3
  assert.equal(getActiveWordIndex(words, 1.8), 2);

  // During last word "Kaizen"
  assert.equal(getActiveWordIndex(words, 3.5), 4);

  // After all words
  assert.equal(getActiveWordIndex(words, 5.0), -1);
});

test('isWordCompleted correctly checks completed state', () => {
  const word: WordTiming = { id: '1', word: 'Kaizen', start: 3.0, end: 4.0 };
  assert.equal(isWordCompleted(word, 2.5), false);
  assert.equal(isWordCompleted(word, 3.5), false);
  assert.equal(isWordCompleted(word, 4.05), true);
});

test('getWordProgress calculates smooth 0 to 1 progress', () => {
  const word: WordTiming = { id: '1', word: 'accountability', start: 1.0, end: 2.0 };
  assert.equal(getWordProgress(word, 0.5), 0);
  assert.equal(getWordProgress(word, 1.0), 0);
  assert.equal(getWordProgress(word, 1.5), 0.5);
  assert.equal(getWordProgress(word, 2.0), 1);
  assert.equal(getWordProgress(word, 2.5), 1);
});

test('generateDefaultTimings produces non-overlapping spaced timings', () => {
  const text = 'cost of accountability whispers: "Kaizen"';
  const timings = generateDefaultTimings(text, 5.0, 0.5);

  assert.equal(timings.length, 5);
  assert.equal(timings[0].word, 'cost');
  assert.equal(timings[4].word, '"Kaizen"');

  for (let i = 0; i < timings.length; i++) {
    assert.ok(timings[i].start < timings[i].end, 'Word start should be before end');
    if (i > 0) {
      assert.ok(timings[i].start >= timings[i - 1].start, 'Words should be sequential');
    }
  }
});

test('generateTornEdgePoints produces valid SVG polygon points', () => {
  const points = generateTornEdgePoints(300, 150, 4, 123);
  assert.ok(points.length > 50);
  assert.match(points, /^[0-9., -]+$/);
});
