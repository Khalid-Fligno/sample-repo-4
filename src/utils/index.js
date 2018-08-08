export const burpeeOptions = [
  { value: null, label: 'Select your completed burpee count' },
];

const populateBurpeeOptions = () => {
  for (let i = 0; i < 50; i += 1) {
    burpeeOptions.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateBurpeeOptions();

export const findFitnessLevel = (burpeeCount) => {
  if (burpeeCount < 12) {
    return 1;
  } else if (burpeeCount > 16) {
    return 3;
  }
  return 2;
};

export const findReps = (fitnessLevel) => {
  if (fitnessLevel === '1') {
    return 10;
  } else if (fitnessLevel === '2') {
    return 14;
  } else if (fitnessLevel === '3') {
    return 18;
  }
  return 10;
};
