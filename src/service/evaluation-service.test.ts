import { Pair } from "../model/pair";
import { Rating } from "../model/rating";
import { Repository } from "../repository/repository";
import { EvaluationServiceImpl } from "./evaluation-service";
import { DownloadUrlProvider } from "./helpers/download-url-provider";

const userId = "user_id";

const somePair: Pair = {
  id: "",
  model1: "model_1",
  model2: "model_2",
  highDetail: true,
  nRatings: 1,
  rotation: [0.0, 0.0, 0.0, 0.0],
  position: [0.0, 0.0, 0.0],
};

const MODEL_1_PLY = "model_1.ply";
const MODEL_2_PLY = "model_2.ply";
const getDownloadUrl: DownloadUrlProvider = (modelName: string) => {
  if (modelName == "model_1") {
    return Promise.resolve(MODEL_1_PLY);
  } else if (modelName == "model_2") {
    return Promise.resolve(MODEL_2_PLY);
  }
  return Promise.resolve("other.ply");
};

const mockedRepository: Repository = {
  getNextPair: async (_getHighDetailModel: boolean) => somePair,
  ratePair: async (_pair: Pair, _rating: Rating) => {},
};

describe("EvaluationService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("User id", () => {
    test("Given no user id in the local storage, when initializing the service and retrieving, then it it must exist", () => {
      const evalService = new EvaluationServiceImpl(
        { ...mockedRepository },
        getDownloadUrl
      );

      expect(evalService.getCurrentUserId()).not.toBeNull();
    });
  });

  describe("next pair", () => {
    test("Given a user id in the local storage, when retrieving the next pair, then the repo method must have been called", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const getNextPair = jest.fn(
        async (_getHighDetailModel: boolean) => somePair
      );
      const evalService = new EvaluationServiceImpl(
        {
          ...mockedRepository,
          getNextPair,
        },
        getDownloadUrl
      );

      await evalService.loadNextPair();

      expect(getNextPair).toHaveBeenCalled();
    });

    test("Given a user id in the local storage and a high detail pair, when retrieving the next pair, then the repo must be called using a low detail model request", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const getNextPair = jest.fn(
        async (_getHighDetailModel: boolean) => somePair
      );
      const evalService = new EvaluationServiceImpl(
        {
          ...mockedRepository,
          getNextPair,
        },
        getDownloadUrl
      );

      evalService.currentPair = {
        ...somePair,
        highDetail: true,
      };
      await evalService.loadNextPair();

      expect(getNextPair).toHaveBeenCalled();
      expect(getNextPair).toHaveBeenCalledWith(false);
    });

    test("Given a user id in the local storage and a low detail pair, when retrieving the next pair, then the repo must be called using a high detail model request", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const getNextPair = jest.fn(
        async (_getHighDetailModel: boolean) => somePair
      );
      const evalService = new EvaluationServiceImpl(
        {
          ...mockedRepository,
          getNextPair,
        },
        getDownloadUrl
      );

      evalService.currentPair = {
        ...somePair,
        highDetail: false,
      };
      await evalService.loadNextPair();

      expect(getNextPair).toHaveBeenCalled();
      expect(getNextPair).toHaveBeenCalledWith(true);
    });

    test("Given a user id in the local storage and a pair, when retrieving the next pair, then it must start the loading state", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const evalService = new EvaluationServiceImpl(
        {
          ...mockedRepository,
        },
        getDownloadUrl
      );
      const loadingStateAction = jest.fn();
      evalService.connectLoadingState(loadingStateAction);
      evalService.loadNextPair();

      expect(loadingStateAction).toHaveBeenCalledTimes(1);
      expect(loadingStateAction).toHaveBeenLastCalledWith(true);
    });

    test("Given a user id in the local storage and a pair, when retrieving the next pair, then it must eventually end the loading state", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const evalService = new EvaluationServiceImpl(
        {
          ...mockedRepository,
        },
        getDownloadUrl
      );
      const loadingStateAction = jest.fn();
      evalService.connectLoadingState(loadingStateAction);
      await evalService.loadNextPair();

      expect(loadingStateAction).toHaveBeenCalledTimes(2);
      expect(loadingStateAction).toHaveBeenLastCalledWith(false);
    });

    test("Given a user id in the local storage and a pair, when retrieving the ply url while not loaded, then it must be null", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const evalService = new EvaluationServiceImpl(
        {
          ...mockedRepository,
        },
        getDownloadUrl
      );

      evalService.loadNextPair();

      expect(evalService.getFirstPlyUrl()).toBeNull();
    });

    test("Given a user id in the local storage and a pair, when retrieving the ply url after loading, then it must return the right ply url", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const evalService = new EvaluationServiceImpl(
        {
          ...mockedRepository,
        },
        getDownloadUrl
      );

      await evalService.loadNextPair();

      expect(evalService.getFirstPlyUrl()).toEqual(MODEL_1_PLY);
    });

    test("Given a user id in the local storage and a pair, when retrieving the second ply url after loading, then it must return the right ply url", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const evalService = new EvaluationServiceImpl(
        {
          ...mockedRepository,
        },
        getDownloadUrl
      );

      await evalService.loadNextPair();

      expect(evalService.getSecondPlyUrl()).toEqual(MODEL_2_PLY);
    });
  });
});
