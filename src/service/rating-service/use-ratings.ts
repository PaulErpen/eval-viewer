import { useState } from "react";

export const useRatings = (userId: string) => {
  const [firstRating, setFirstRating] = useState<number | null>(null);
  const [secondRating, setSecondRating] = useState<number | null>(null);


};
