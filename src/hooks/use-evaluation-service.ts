import { useState } from "react";
import { useServiceContext } from "../context/service-context";
import { Pair } from "../model/pair";
import { RatingProviderImpl } from "../service/rating-provider/rating-provider";

export interface EvaluationHookResult {
  isLoading: boolean;
  showFirstModel: boolean;
  toggleModels: () => void;
  firstPlyUrl: string | null;
  secondPlyUrl: string | null;
  currentPair: Pair | null;
  isRatingReady: boolean;
  firstRating: number | null;
  setFirstRating: (firstRating: number) => void;
  secondRating: number | null;
  setSecondRating: (secondRating: number) => void;
}

export const useEvaluationHook: () => EvaluationHookResult = () => {
  const { evaluationService } = useServiceContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFirstModel, setShowFirstModel] = useState<boolean>(false);

  const [firstRating, setFirstRating] = useState<number | null>(null);
  const [secondRating, setSecondRating] = useState<number | null>(null);

  evaluationService.connectLoadingState(setIsLoading);

  if (evaluationService.getCurrentPair() === null && !isLoading) {
    evaluationService.loadNextPair();
  }

  const firstPlyUrl = evaluationService.getFirstPlyUrl();
  const secondPlyUrl = evaluationService.getSecondPlyUrl();
  const currentPair = evaluationService.getCurrentPair();
  const ratingProvider = new RatingProviderImpl(
    evaluationService.getCurrentUserId(),
    currentPair?.id ?? null,
    firstRating,
    secondRating
  );

  return {
    isLoading,
    showFirstModel,
    toggleModels: () => setShowFirstModel((prev) => !prev),
    firstPlyUrl,
    secondPlyUrl,
    currentPair,
    isRatingReady: ratingProvider.isReady(),
    firstRating,
    setFirstRating,
    secondRating,
    setSecondRating,
  };
};
