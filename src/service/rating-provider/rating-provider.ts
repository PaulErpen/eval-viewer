import { Rating } from "../../model/rating";

export interface RatingProvider {
  isReady: () => boolean;
  getRating: () => Rating;
}

export class RatingProviderImpl implements RatingProvider {
  private userId: string | null;
  private pairId: string | null;
  private firstRating: number | null;
  private secondRating: number | null;

  constructor(
    userId: string | null,
    pairId: string | null,
    firstRating: number | null,
    secondRating: number | null
  ) {
    this.userId = userId;
    this.pairId = pairId;
    this.firstRating = firstRating;
    this.secondRating = secondRating;
  }

  isReady = () => {
    return (
      this.userId != null &&
      this.pairId != null &&
      this.firstRating != null &&
      this.secondRating != null
    );
  };

  getRating = () => {
    if (!this.isReady()) {
      throw new Error("Rating is not ready yet!");
    }
    return {
      id: "",
      pairId: this.pairId ?? "",
      userId: this.userId ?? "",
      rating1: this.firstRating ?? -1,
      rating2: this.secondRating ?? -1,
    };
  };
}
