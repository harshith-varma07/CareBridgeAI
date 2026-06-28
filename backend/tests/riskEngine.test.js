import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRisk } from '../src/utils/riskEngine.js';

test('returns RED for fever', () => {
  assert.equal(calculateRisk({ painLevel: 1, fever: true, redness: false, discharge: false, infectionProbability: 0.1 }), 'RED');
});

test('returns YELLOW for moderate pain', () => {
  assert.equal(calculateRisk({ painLevel: 6, fever: false, redness: false, discharge: false, infectionProbability: 0.2 }), 'YELLOW');
});

test('returns GREEN for low symptoms', () => {
  assert.equal(calculateRisk({ painLevel: 2, fever: false, redness: false, discharge: false, infectionProbability: 0.2 }), 'GREEN');
});
