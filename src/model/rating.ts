export type RatingType = "first" | "second" | "neither";

export interface Rating {
  id: string;
  userId: string;
  pairId: string;
  rating: RatingType;
  dataset: string;
  technique1: string;
  technique2: string;
  size: string;
}
