import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getActiveScene,
  getActiveSceneIndex,
  getSceneProgress,
  splitTextWithHighlight,
  formatTime
} from './montageSync';
import { NewspaperScene } from '../types';

const testScenes: NewspaperScene[] = [
  {
    id: 's1',
    type: 'quote',
    startTime: 0,
    endTime: 1.18,
    headline: 'It was not Heaven routine',
    highlightWord: 'Heaven',
  },
  {
    id: 's2',
    type: 'masthead',
    startTime: 1.18,
    endTime: 2.27,
    headline: 'Police confirm Heaven. Decline to elaborate.',
    highlightWord: 'Heaven',
  },
  {
    id: 's3',
    type: 'macro-column',
    startTime: 2.27,
    endTime: 3.77,
    headline: 'Heaven has since moved to new offices.',
    highlightWord: 'Heaven',
  },
];

test('getActiveScene and getActiveSceneIndex identify scenes correctly across time', () => {
  assert.equal(getActiveSceneIndex(testScenes, 0.5), 0);
  assert.equal(getActiveScene(testScenes, 0.5)?.id, 's1');

  assert.equal(getActiveSceneIndex(testScenes, 1.2), 1);
  assert.equal(getActiveScene(testScenes, 1.2)?.id, 's2');

  assert.equal(getActiveSceneIndex(testScenes, 3.0), 2);
  assert.equal(getActiveScene(testScenes, 3.0)?.id, 's3');

  // After all scenes
  assert.equal(getActiveSceneIndex(testScenes, 5.0), 2);
  assert.equal(getActiveScene(testScenes, 5.0)?.id, 's3');
});

test('getSceneProgress computes 0 to 1 progress within a scene', () => {
  const scene = testScenes[0]; // 0 -> 1.18
  assert.equal(getSceneProgress(scene, 0), 0);
  assert.equal(Math.round(getSceneProgress(scene, 0.59) * 100), 50);
  assert.equal(getSceneProgress(scene, 1.18), 1);
});

test('splitTextWithHighlight accurately tokenizes and marks target word', () => {
  const text = 'Police confirm Heaven. Decline to elaborate.';
  const chunks = splitTextWithHighlight(text, 'Heaven');

  assert.equal(chunks.length, 3);
  assert.equal(chunks[0].text, 'Police confirm ');
  assert.equal(chunks[0].isHighlighted, false);

  assert.equal(chunks[1].text, 'Heaven');
  assert.equal(chunks[1].isHighlighted, true);

  assert.equal(chunks[2].text, '. Decline to elaborate.');
  assert.equal(chunks[2].isHighlighted, false);
});

test('formatTime produces correct mm:ss.cc string', () => {
  assert.equal(formatTime(0), '00:00.00');
  assert.equal(formatTime(1.18), '00:01.18');
  assert.equal(formatTime(65.4), '01:05.40');
});
