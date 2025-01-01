import { Pair } from "../model/pair";
import { Rating } from "../model/rating";
import { Repository } from "../repository/repository";
import { EvaluationServiceImpl } from "./evaluation-service";

const mockedRepository: Repository = {
  getNextPair: async (getHighDetailModel: boolean) => {
    return {
      id: "",
      model1: "",
      model2: "",
      highDetail: true,
      nRatings: 1,
    };
  },
  ratePair: async (pair: Pair, rating: Rating) => {},
};

describe("EvaluationService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("User id", () => {
    test("Given no user id in the local storage, when retrieving the user id, then it must be null", () => {
      const evalService = new EvaluationServiceImpl({ ...mockedRepository });

      expect(evalService.getCurrentUserId()).toBeNull();
    });

    test("Given a user id in local storage, when retrieving, then the user id must match", () => {
      const userId = "user_id";
      localStorage.setItem("USER_ID_LOCAL_STORAGE_KEY", userId);
      const evalService = new EvaluationServiceImpl({ ...mockedRepository });

      expect(evalService.getCurrentUserId()).toEqual(userId);
    });
  });

  describe("next pair", () => {
    test("Given no user id in the local storage, when retrieving the next pair, then return null", async () => {
      const evalService = new EvaluationServiceImpl({ ...mockedRepository });

      expect(await evalService.getNextPair()).toBeNull();
    });
  });
});
