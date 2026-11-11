import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateFocalText,
  extractFocalWord,
  formatWeeklyCutsCount,
  generateMatchCutScenesForWord,
  getGenerationSteps,
} from './textMatchCut';

test('validateFocalText enforces 23 character limit', () => {
  const shortText = 'Heaven';
  const res1 = validateFocalText(shortText, 23);
  assert.equal(res1.isValid, true);
  assert.equal(res1.charCount, 6);
  assert.equal(res1.remainingChars, 17);

  const longText = 'This sentence is way too long for a focal cut';
  const res2 = validateFocalText(longText, 23);
  assert.equal(res2.value.length, 23);
  assert.equal(res2.remainingChars, 0);
  assert.equal(res2.value, 'This sentence is way to');
});

test('extractFocalWord retrieves target word or detects capitalized focal word', () => {
  assert.equal(extractFocalWord('It was not Heaven routine', 'Heaven'), 'Heaven');
  assert.equal(extractFocalWord('It was not Heaven routine'), 'Heaven');
  assert.equal(extractFocalWord('the code is Kaizen'), 'Kaizen');
});

test('formatWeeklyCutsCount formats count with commas', () => {
  assert.equal(formatWeeklyCutsCount(62000), '62,000+ match cuts generated this week');
});

test('generateMatchCutScenesForWord produces 5 synchronized cuts highlighting the user word', () => {
  const customWord = 'Kaizen';
  const scenes = generateMatchCutScenesForWord(customWord);
  assert.equal(scenes.length, 5);
  // All scenes must highlight the specific word
  scenes.forEach((scene) => {
    assert.equal(scene.highlightWord, 'Kaizen');
    assert.equal(scene.highlightColor, '#FFE817');
    assert.ok(scene.headline.includes('Kaizen') || (scene.bodyColumns && scene.bodyColumns.some((c) => c.includes('Kaizen'))));
  });
  // Check timeline coverage spans 0.0 to 5.29s seamlessly
  assert.equal(scenes[0].startTime, 0.0);
  assert.equal(scenes[scenes.length - 1].endTime, 5.29);
});

test('getGenerationSteps returns 5 contextual steps mentioning the target word', () => {
  const steps = getGenerationSteps('Bitcoin');
  assert.equal(steps.length, 5);
  assert.ok(steps[0].includes('Bitcoin'));
  assert.ok(steps[2].includes('Bitcoin'));
});

