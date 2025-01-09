import { useState } from "react";
import { useServiceContext } from "../context/service-context";
import { Pair } from "../model/pair";
import { RatingProviderImpl } from "../service/rating-provider/rating-provider";

export interface EvaluationHookResult {
  isLoading: boolean;
  showFirstModel: boolean;
  toggleModels: () => void;
  getFirstPlyUrl: () => string | null;
  getSecondPlyUrl: () => string | null;
  currentPair: Pair | null;
  isRatingReady: boolean;
  firstRating: number | null;
  setFirstRating: (firstRating: number) => void;
  secondRating: number | null;
  setSecondRating: (secondRating: number) => void;
  loadNextPair: () => void;
  isInTutorialMode: boolean;
}

export const useEvaluationHook: () => EvaluationHookResult = () => {
  const { evaluationService } = useServiceContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFirstModel, setShowFirstModel] = useState<boolean>(true);

  const [firstRating, setFirstRating] = useState<number | null>(null);
  const [secondRating, setSecondRating] = useState<number | null>(null);

  evaluationService.connectLoadingState(setIsLoading);

  const currentPair = evaluationService.getCurrentPair();
  const ratingProvider = new RatingProviderImpl(
    evaluationService.getCurrentUserId(),
    currentPair?.id ?? null,
    firstRating,
    secondRating
  );
  const isRatingReady = ratingProvider.isReady();
  const isInTutorialMode = evaluationService.isInTutorialMode();

  return {
    isLoading,
    showFirstModel,
    toggleModels: () => setShowFirstModel((prev) => !prev),
    getFirstPlyUrl: evaluationService.getFirstPlyUrl,
    getSecondPlyUrl: evaluationService.getSecondPlyUrl,
    currentPair,
    isRatingReady,
    firstRating,
    setFirstRating,
    secondRating,
    setSecondRating,
    loadNextPair: async () => {
      if (!isLoading && isRatingReady) {
        if (!isInTutorialMode) {
          evaluationService.submitRating(ratingProvider.getRating());
        }

        await evaluationService.loadNextPair();
        setFirstRating(null);
        setSecondRating(null);
        setShowFirstModel(true);
      }
    },
    isInTutorialMode,
  };
};
