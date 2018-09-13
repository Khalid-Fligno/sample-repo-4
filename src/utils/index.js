export const uomMap = {
  metric: 'Metric (cm, kg)',
  imperial: 'Imperial (inch, lb)',
};

export const weightOptions = [
  { value: 30, label: '30' },
];

const populateWeightOptions = () => {
  for (let i = 31; i <= 120; i += 1) {
    weightOptions.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateWeightOptions();

export const waistOptions = [
  { value: 20, label: '20' },
];

const populateWaistOptions = () => {
  for (let i = 21; i <= 120; i += 1) {
    waistOptions.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateWaistOptions();

export const hipOptions = [
  { value: 20, label: '20' },
];

const populateHipOptions = () => {
  for (let i = 21; i <= 120; i += 1) {
    hipOptions.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateHipOptions();

export const burpeeOptions = [
  { value: 0, label: '0' },
];

const populateBurpeeOptions = () => {
  for (let i = 1; i <= 50; i += 1) {
    burpeeOptions.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateBurpeeOptions();

export const findFitnessLevel = (burpeeCount) => {
  if (burpeeCount <= 12) {
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
