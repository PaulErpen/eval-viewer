const datasetNames = ["truck", "room", "stump"];
const sizes = ["low", "medium", "high"];

const fillPreviousValues = (
  previousValues: Array<any>,
  allChoices: Array<any>
) => {
  const errorValue = previousValues.find(
    (value) => !allChoices.includes(value)
  );
  if (errorValue) {
    throw new Error(
      `Found value ${errorValue} which is not contained in ${allChoices}`
    );
  }

  if (previousValues.length == 2) {
    return [...previousValues];
  } else {
    const filteredValues = allChoices
      .filter((a) => !previousValues.includes(a))
      .sort(() => Math.random() - 0.5);
    return [...previousValues, ...filteredValues].slice(0, 2);
  }
};

export const fillPreviousDatasets = (
  previousDataset: null | string,
  previousPreviousDataset: null | string
) => {
  const previousDatasets = [];
  if (previousDataset) {
    previousDatasets.push(previousDataset);
  }
  if (previousPreviousDataset) {
    previousDatasets.push(previousPreviousDataset);
  }
  return fillPreviousValues(previousDatasets, datasetNames);
};

export const fillPreviousSizes = (
  previousSize: null | string,
  previousPreviousSize: null | string
) => {
  const previousSizes = [];
  if (previousSize) {
    previousSizes.push(previousSize);
  }
  if (previousPreviousSize) {
    previousSizes.push(previousPreviousSize);
  }
  return fillPreviousValues(previousSizes, sizes);
};
