import { Pair } from "../model/pair";
import { Rating } from "../model/rating";
import { Repository } from "../repository/repository";
import { EvaluationServiceImpl } from "./evaluation-service";

const somePair: Pair = {
  id: "id",
  model1: "model1",
  model2: "model2",
  highDetail: true,
  nRatings: 0,
  rotation: [0, 0, 0, 0],
  position: [0, 0, 0],
  fovY: 0,
  aspect: 1.0,
  initialDistance: 1,
  datasetName: "datasetName",
  size: "size",
  technique1: "technique1",
  technique2: "technique2",
};

const downloadUrlProvider = () => Promise.resolve("");
describe("EvaluationService", () => {
  const defaultRepository: Repository = {
    getNextPair: (_previousPairs: Array<Pair>) => {
      return Promise.resolve({ ...somePair });
    },
    ratePair: (_pair: Pair, _rating: Rating) => {
      return Promise.resolve();
    },
    submitRating: (_rating: Rating) => {
      return Promise.resolve();
    },
  };

  describe("loadNextPair", () => {
    test("given a fresh service, when loading the next pair, the repository call must not inlcude any previous pairs", async () => {
      const getNextPair = jest.fn((_previousPairs: Array<Pair>) =>
        Promise.resolve({ ...somePair })
      );
      const service = new EvaluationServiceImpl(
        { ...defaultRepository, getNextPair },
        downloadUrlProvider
      );

      await service.loadNextPair();

      expect(getNextPair).toHaveBeenCalledTimes(1);
      expect(getNextPair.mock.calls[0][0]).toHaveLength(0);
    });

    test("given a fresh service, when loading the next pair twice, the repository call must inlcude one previous pair", async () => {
      const getNextPair = jest.fn((_previousPairs: Array<Pair>) =>
        Promise.resolve({ ...somePair })
      );
      const service = new EvaluationServiceImpl(
        { ...defaultRepository, getNextPair },
        downloadUrlProvider
      );

      await service.loadNextPair();
      await service.loadNextPair();

      expect(getNextPair).toHaveBeenCalledTimes(2);
      expect(getNextPair.mock.calls[0][0]).toHaveLength(1);
      expect(getNextPair.mock.calls[0][0]).toContainEqual(somePair);
    });

    test("given a fresh service, when loading the next pair three times, the repository call must inlcude two previous pairs", async () => {
      const getNextPair = jest.fn((_previousPairs: Array<Pair>) =>
        Promise.resolve({ ...somePair })
      );
      const service = new EvaluationServiceImpl(
        { ...defaultRepository, getNextPair },
        downloadUrlProvider
      );

      await service.loadNextPair();
      await service.loadNextPair();
      await service.loadNextPair();

      expect(getNextPair).toHaveBeenCalledTimes(3);
      expect(getNextPair.mock.calls[0][0]).toHaveLength(2);
      expect(getNextPair.mock.calls[0][0][0]).toEqual(somePair);
      expect(getNextPair.mock.calls[0][0][1]).toEqual(somePair);
    });
  });
});
