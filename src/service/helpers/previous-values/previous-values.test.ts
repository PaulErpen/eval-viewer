import { fillPreviousDatasets } from "./previous-values";

describe("previous values", () => {
  describe("dataset", () => {
    describe("no previous values", () => {
      test("given no previous values, when executing, then return an array of length 2", () => {
        expect(fillPreviousDatasets(null, null)).toHaveLength(2);
      });

      test("given no previous values, when executing, then the values cannot equal", () => {
        const [firstValue, secondValue] = fillPreviousDatasets(null, null);
        expect(firstValue).not.toEqual(secondValue);
      });

      test("given no previous values, when executing, then the values cannot be null", () => {
        const [firstValue, secondValue] = fillPreviousDatasets(null, null);
        expect(firstValue).not.toBeNull();
        expect(secondValue).not.toBeNull();
      });
    });

    describe("one previous value", () => {
      test("given one previous values, when executing, then return an array of length 2", () => {
        expect(fillPreviousDatasets("stump", null)).toHaveLength(2);
      });

      test("given one previous values, when executing, then the values cannot equal", () => {
        const [firstValue, secondValue] = fillPreviousDatasets("stump", null);
        expect(firstValue).not.toEqual(secondValue);
      });

      test("given one previous values, when executing, then the values cannot be null", () => {
        const [firstValue, secondValue] = fillPreviousDatasets("stump", null);
        expect(firstValue).not.toBeNull();
        expect(secondValue).not.toBeNull();
      });

      test("given one previous values, when executing, then the first value must be stump", () => {
        const [firstValue, _] = fillPreviousDatasets("stump", null);
        expect(firstValue).toEqual("stump");
      });
    });

    describe("two previous values", () => {
      test("given one previous values, when executing, then return an array of length 2", () => {
        expect(fillPreviousDatasets("stump", "room")).toHaveLength(2);
      });

      test("given one previous values, when executing, then the values cannot equal", () => {
        const [firstValue, secondValue] = fillPreviousDatasets("stump", "room");
        expect(firstValue).not.toEqual(secondValue);
      });

      test("given one previous values, when executing, then the values cannot be null", () => {
        const [firstValue, secondValue] = fillPreviousDatasets("stump", "room");
        expect(firstValue).not.toBeNull();
        expect(secondValue).not.toBeNull();
      });

      test("given one previous values, when executing, then the first value must be stump", () => {
        const [firstValue, _] = fillPreviousDatasets("stump", "room");
        expect(firstValue).toEqual("stump");
      });

      test("given one previous values, when executing, then the second value must be room", () => {
        const [_, secondValue] = fillPreviousDatasets("stump", "room");
        expect(secondValue).toEqual("room");
      });
    });
  });
});
