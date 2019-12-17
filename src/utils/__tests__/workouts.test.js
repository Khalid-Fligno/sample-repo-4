import { findFocus, findLocation } from '../workouts';

describe('findFocus', () => {
  test('Upper body workout returns correctly', () => {
    expect(findFocus({ upperBody: true })).toBe('Upper');
  });

  test('ABT workout returns correctly', () => {
    expect(findFocus({ lowerBody: true })).toBe('A, B & T');
  });

  test('Upper body workout returns correctly', () => {
    expect(findFocus({ fullBody: true })).toBe('Full');
  });

  test('Missing focus returns null', () => {
    expect(findFocus({})).toBe(null);
  });
});

describe('findLocation', () => {
  test('Gym workout returns correctly', () => {
    expect(findLocation({ gym: true })).toBe('Gym');
  });

  test('Home workout returns correctly', () => {
    expect(findLocation({ home: true })).toBe('Home');
  });

  test('Outdoors workout returns correctly', () => {
    expect(findLocation({ outdoors: true })).toBe('Outdoors');
  });

  test('Missing location returns null', () => {
    expect(findLocation({})).toBe(null);
  });
});
