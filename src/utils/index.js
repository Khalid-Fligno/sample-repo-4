export const uomMap = {
  metric: 'Metric (cm, kg)',
  imperial: 'Imperial (inch, lb)',
};

export const weightOptionsMetric = [
  { value: 30, label: '30' },
];

const populateWeightOptionsMetric = () => {
  for (let i = 31; i <= 120; i += 1) {
    weightOptionsMetric.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateWeightOptionsMetric();

export const waistOptionsMetric = [
  { value: 20, label: '20' },
];

const populateWaistOptionsMetric = () => {
  for (let i = 21; i <= 120; i += 1) {
    waistOptionsMetric.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateWaistOptionsMetric();

export const hipOptionsMetric = [
  { value: 20, label: '20' },
];

const populateHipOptionsMetric = () => {
  for (let i = 21; i <= 120; i += 1) {
    hipOptionsMetric.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateHipOptionsMetric();

export const weightOptionsImperial = [
  { value: 60, label: '60' },
];

const populateWeightOptionsImperial = () => {
  for (let i = 61; i <= 240; i += 1) {
    weightOptionsImperial.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateWeightOptionsImperial();

export const waistOptionsImperial = [
  { value: 15, label: '15' },
];

const populateWaistOptionsImperial = () => {
  for (let i = 16; i <= 60; i += 1) {
    waistOptionsImperial.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateWaistOptionsImperial();

export const hipOptionsImperial = [
  { value: 15, label: '15' },
];

const populateHipOptionsImperial = () => {
  for (let i = 16; i <= 60; i += 1) {
    hipOptionsImperial.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateHipOptionsImperial();

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

export const diff = (a, b) => {
  if ((b - a) > 0) {
    return `+${(b - a)}`;
  } else if ((b - a) < 0) {
    return (b - a);
  }
  return null;
};
