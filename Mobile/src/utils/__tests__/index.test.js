import { findFitnessLevel, findReps, diff } from '../index';

describe('Find Fitness Level', () => {
  test('BurpeeCount 0 return fitness level 1', () => {
    expect(findFitnessLevel(0)).toBe(1);
  });

  test('BurpeeCount 14 return fitness level 2', () => {
    expect(findFitnessLevel(14)).toBe(2);
  });

  test('BurpeeCount 50 return fitness level 3', () => {
    expect(findFitnessLevel(50)).toBe(3);
  });
});

describe('Find Reps', () => {
  test('Fitness level 1 returns 10 reps', () => {
    expect(findReps('1')).toBe('10');
  });

  test('Fitness level 2 returns 14 reps', () => {
    expect(findReps('2')).toBe('14');
  });

  test('Fitness level 3 returns 18 reps', () => {
    expect(findReps('3')).toBe('18');
  });

  test('Fitness level returns 10 reps by default', () => {
    expect(findReps()).toBe('10');
  });
});

describe('Diff', () => {
  test('Diff returns correctly positive', () => {
    expect(diff(1, 2)).toBe('+1');
  });

  test('Diff returns correctly negative', () => {
    expect(diff(2, 1)).toBe('-1');
  });

  test('Diff returns null by default', () => {
    expect(diff()).toBeNull();
  });
});
