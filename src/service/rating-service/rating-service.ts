import { Rating } from "../../model/rating";

export interface RatingService {
  isReady: () => boolean;
  setFirstRating: (rating: number) => void;
  setSecondRating: (rating: number) => void;
  getRating: () => Rating;
}

export class RatingServiceImpl implements RatingService {
  private userId: string;
  private pairId: string;
  private firstRating: number | null;
  private secondRating: number | null;

  constructor(userId: string, pairId: string) {
    this.userId = userId;
    this.pairId = pairId;
    this.firstRating = null;
    this.secondRating = null;
  }

  isReady = () => {
    return this.firstRating != null && this.secondRating != null;
  };

  setFirstRating = (rating: number) => {
    this.firstRating = rating;
  };
  setSecondRating = (rating: number) => {
    this.secondRating = rating;
  };
  getRating = () => {
    if (!this.isReady()) {
      throw new Error("Rating is not ready yet!");
    }
    return {
      id: "",
      pairId: this.pairId,
      userId: this.userId,
      rating1: this.firstRating ?? -1,
      rating2: this.secondRating ?? -1,
    };
  };
}
