import { useEffect, useState } from "react";
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
  loadNextPair: () => void;
  isInTutorialMode: boolean;
}

export const useEvaluationHook: () => EvaluationHookResult = () => {
  const { evaluationService } = useServiceContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFirstModel, setShowFirstModel] = useState<boolean>(true);
  const [firstPlyUrl, setFirstPlyUrl] = useState<string | null>(null);
  const [secondPlyUrl, setSecondPlyUrl] = useState<string | null>(null);

  const [firstRating, setFirstRating] = useState<number | null>(null);
  const [secondRating, setSecondRating] = useState<number | null>(null);

  const currentPair = evaluationService.getCurrentPair();
  const ratingProvider = new RatingProviderImpl(
    evaluationService.getCurrentUserId(),
    currentPair?.id ?? null,
    firstRating,
    secondRating
  );
  const isRatingReady = ratingProvider.isReady();
  const isInTutorialMode = evaluationService.isInTutorialMode();

  useEffect(() => {
    evaluationService.getPlyUrls().then(({ plyUrl1, plyUrl2 }) => {
      if (!isLoading) {
        if (plyUrl1 !== firstPlyUrl) {
          setFirstPlyUrl(plyUrl1);
        }
        if (plyUrl2 !== secondPlyUrl) {
          setSecondPlyUrl(plyUrl2);
        }
      }
    });
  }, [isLoading]);

  return {
    isLoading,
    showFirstModel,
    toggleModels: () => setShowFirstModel((prev) => !prev),
    firstPlyUrl,
    secondPlyUrl,
    currentPair,
    isRatingReady,
    firstRating,
    setFirstRating,
    secondRating,
    setSecondRating,
    loadNextPair: async () => {
      setIsLoading(true);
      if (!isLoading && isRatingReady) {
        if (!isInTutorialMode) {
          evaluationService.submitRating(ratingProvider.getRating());
        }

        await evaluationService.loadNextPair();
        setFirstRating(null);
        setSecondRating(null);
        setShowFirstModel(true);
      }
      setIsLoading(false);
    },
    isInTutorialMode,
  };
};
