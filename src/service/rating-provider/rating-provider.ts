import { Rating, RatingType } from "../../model/rating";

export interface RatingProvider {
  isReady: () => boolean;
  getRating: () => Rating;
}

export class RatingProviderImpl implements RatingProvider {
  private userId: string | null;
  private pairId: string | null;
  private dataset: string | null;
  private technique1: string | null;
  private technique2: string | null;
  private size: string | null;
  private rating: null | RatingType;

  constructor(
    userId: string | null,
    pairId: string | null,
    rating: RatingType | null,
    dataset: string | null,
    technique1: string | null,
    technique2: string | null,
    size: string | null
  ) {
    this.userId = userId;
    this.pairId = pairId;
    this.rating = rating;
    this.dataset = dataset;
    this.technique1 = technique1;
    this.technique2 = technique2;
    this.size = size;
  }

  isReady = () => {
    return (
      this.userId != null &&
      this.pairId != null &&
      this.rating != null &&
      this.dataset != null &&
      this.technique1 != null &&
      this.technique2 != null &&
      this.size != null
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
      dataset: this.dataset ?? "",
      technique1: this.technique1 ?? "",
      technique2: this.technique2 ?? "",
      size: this.size ?? "",
      rating: this.rating ?? "neither",
      timestamp: new Date().toISOString(),
    };
  };
}
