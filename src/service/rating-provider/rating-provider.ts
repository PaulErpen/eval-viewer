import { Rating, RatingType } from "../../model/rating";

export interface RatingProvider {
  isReady: () => boolean;
  getRating: () => Rating;
}

export class RatingProviderImpl implements RatingProvider {
  private userId: string | null;
  private pairId: string | null;
  private rating: null | RatingType;

  constructor(
    userId: string | null,
    pairId: string | null,
    rating: RatingType | null
  ) {
    this.userId = userId;
    this.pairId = pairId;
    this.rating = rating;
  }

  isReady = () => {
    return this.userId != null && this.pairId != null && this.rating != null;
  };

  getRating = () => {
    if (!this.isReady()) {
      throw new Error("Rating is not ready yet!");
    }
    return {
      id: "",
      pairId: this.pairId ?? "",
      userId: this.userId ?? "",
      rating: this.rating ?? "neither",
    };
  };
}
