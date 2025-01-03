import { Pair } from "../model/pair";
import { Rating } from "../model/rating";
import { Repository } from "../repository/repository";
import { EvaluationServiceImpl } from "./evaluation-service";

const userId = "user_id";

const somePair: Pair = {
  id: "",
  model1: "",
  model2: "",
  highDetail: true,
  nRatings: 1,
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
    test("Given no user id in the local storage, when initializing a new user id and retrieving, then it it must exist", () => {
      const evalService = new EvaluationServiceImpl({ ...mockedRepository });

      expect(evalService.getCurrentUserId()).toBeNull();
      const userId = evalService.createUserId();
      expect(evalService.getCurrentUserId()).toEqual(userId);
    });

    test("Given no user id in the local storage, when retrieving the user id, then it must be null", () => {
      const evalService = new EvaluationServiceImpl({ ...mockedRepository });

      expect(evalService.getCurrentUserId()).toBeNull();
    });

    test("Given a user id in local storage, when retrieving, then the user id must match", () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const evalService = new EvaluationServiceImpl({ ...mockedRepository });

      expect(evalService.getCurrentUserId()).toEqual(userId);
    });
  });

  describe("next pair", () => {
    test("Given no user id in the local storage, when retrieving the next pair, then return null", async () => {
      const evalService = new EvaluationServiceImpl({ ...mockedRepository });

      expect(await evalService.getNextPair(null)).toBeNull();
    });

    test("Given a user id in the local storage, when retrieving the next pair, then the repo method must have been called", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const getNextPair = jest.fn(
        async (_getHighDetailModel: boolean) => somePair
      );
      const evalService = new EvaluationServiceImpl({
        ...mockedRepository,
        getNextPair,
      });

      await evalService.getNextPair(null);

      expect(getNextPair).toHaveBeenCalled();
    });

    test("Given a user id in the local storage and a high detail pair, when retrieving the next pair, then the repo must be called using a low detail model request", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const getNextPair = jest.fn(
        async (_getHighDetailModel: boolean) => somePair
      );
      const evalService = new EvaluationServiceImpl({
        ...mockedRepository,
        getNextPair,
      });

      await evalService.getNextPair({
        ...somePair,
        highDetail: true,
      });

      expect(getNextPair).toHaveBeenCalled();
      expect(getNextPair).toHaveBeenCalledWith(false);
    });

    test("Given a user id in the local storage and a low detail pair, when retrieving the next pair, then the repo must be called using a high detail model request", async () => {
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const getNextPair = jest.fn(
        async (_getHighDetailModel: boolean) => somePair
      );
      const evalService = new EvaluationServiceImpl({
        ...mockedRepository,
        getNextPair,
      });

      await evalService.getNextPair({
        ...somePair,
        highDetail: false,
      });

      expect(getNextPair).toHaveBeenCalled();
      expect(getNextPair).toHaveBeenCalledWith(true);
    });
  });
});
