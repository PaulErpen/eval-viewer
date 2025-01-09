import { Rating } from "../../model/rating";
import { RatingProviderImpl } from "./rating-provider";

const USER_ID = "user-id";
const PAIR_ID = "pair-id";

describe("RatingService", () => {
  test("Given a new RatingService, when initializing, it must not be ready", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, null, null);

    expect(service.isReady()).toBeFalsy();
  });

  test("Given a new RatingService, when setting the first rating, it must not be ready", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, 3, null);

    expect(service.isReady()).toBeFalsy();
  });

  test("Given a new RatingService, when setting the second rating, it must not be ready", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, null, 3);

    expect(service.isReady()).toBeFalsy();
  });

  test("Given a new RatingService, when setting both ratings, it must be ready", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, 3, 1);

    expect(service.isReady()).toBeTruthy();
  });

  test("Given a new RatingService, when setting both ratings and retrieving the pair, then the pair must match the expectations", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, 3, 1);

    const expectedRating: Rating = {
      id: "",
      pairId: PAIR_ID,
      userId: USER_ID,
      rating1: 3,
      rating2: 1,
    };
    expect(service.getRating()).toMatchObject(expectedRating);
  });

  test("Given a new RatingService, when retrieving the pair while not ready, then it must throw an error", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, null, null);

    expect(() => service.getRating()).toThrow();
  });
});
