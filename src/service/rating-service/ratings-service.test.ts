import { Rating } from "../../model/rating";
import { RatingServiceImpl } from "./rating-service";

const USER_ID = "user-id";
describe("RatingService", () => {
  test("Given a new RatingService, when initializing, it must not be ready", () => {
    const service = new RatingServiceImpl(USER_ID);

    expect(service.isReady()).toBeFalsy();
  });

  test("Given a new RatingService, when setting the first rating, it must not be ready", () => {
    const service = new RatingServiceImpl(USER_ID);

    service.setFirstRating(3);

    expect(service.isReady()).toBeFalsy();
  });

  test("Given a new RatingService, when setting the second rating, it must not be ready", () => {
    const service = new RatingServiceImpl(USER_ID);

    service.setFirstRating(3);

    expect(service.isReady()).toBeFalsy();
  });

  test("Given a new RatingService, when setting both ratings, it must be ready", () => {
    const service = new RatingServiceImpl(USER_ID);

    service.setFirstRating(3);
    service.setSecondRating(1);

    expect(service.isReady()).toBeTruthy();
  });

  test("Given a new RatingService, when setting both ratings and retrieving the pair, then the pair must match the expectations", () => {
    const service = new RatingServiceImpl(USER_ID);

    service.setFirstRating(3);
    service.setSecondRating(1);

    const expectedRating: Rating = {
      id: "",
      userId: USER_ID,
      rating1: 3,
      rating2: 1,
    };
    expect(service.getRating()).toMatchObject(expectedRating);
  });

  test("Given a new RatingService, when retrieving the pair while not ready, then it must throw an error", () => {
    const service = new RatingServiceImpl(USER_ID);

    expect(() => service.getRating()).toThrow();
  });
});
