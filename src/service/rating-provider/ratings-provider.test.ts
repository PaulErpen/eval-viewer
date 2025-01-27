import { Rating } from "../../model/rating";
import { RatingProviderImpl } from "./rating-provider";

const USER_ID = "user-id";
const PAIR_ID = "pair-id";

describe("RatingService", () => {
  test("Given a new RatingService, when initializing, it must not be ready", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, null);

    expect(service.isReady()).toBeFalsy();
  });

  test("Given a new RatingService, when setting the rating, it must be ready", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, "first");

    expect(service.isReady()).toBeTruthy();
  });

  test("Given a new RatingService, when setting both ratings and retrieving the pair, then the pair must match the expectations", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, "neither");

    const expectedRating: Rating = {
      id: "",
      pairId: PAIR_ID,
      userId: USER_ID,
      rating: "neither",
    };
    expect(service.getRating()).toMatchObject(expectedRating);
  });

  test("Given a new RatingService, when retrieving the pair while not ready, then it must throw an error", () => {
    const service = new RatingProviderImpl(USER_ID, PAIR_ID, null);

    expect(() => service.getRating()).toThrow();
  });
});
