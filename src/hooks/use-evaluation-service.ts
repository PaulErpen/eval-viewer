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
  loadNextPair: () => void;
  isInTutorialMode: boolean;
  nPairsRated: number;
  isFinished: boolean;
  restartEvaluation: () => Promise<void>;
  isCameraControlsExpanded: boolean;
  setIsCameraControlsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useEvaluationHook: (
  skipTutorial: boolean
) => EvaluationHookResult = (skipTutorial: boolean) => {
  const { evaluationService } = useServiceContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFirstModel, setShowFirstModel] = useState<boolean>(true);
  const [firstPlyUrl, setFirstPlyUrl] = useState<string | null>(null);
  const [secondPlyUrl, setSecondPlyUrl] = useState<string | null>(null);

  const [firstRating, setFirstRating] = useState<number | null>(null);
  const [secondRating, setSecondRating] = useState<number | null>(null);
  const [nPairsRated, setNPairsRated] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [isCameraControlsExpanded, setIsCameraControlsExpanded] =
    useState(true);

  const currentPair = evaluationService.getCurrentPair();
  const ratingProvider = new RatingProviderImpl(
    evaluationService.getCurrentUserId(),
    currentPair?.id ?? null,
    firstRating,
    secondRating
  );
  const isRatingReady = ratingProvider.isReady();
  const isInTutorialMode = evaluationService.isInTutorialMode();

  const loadNext = async () => {
    setIsLoading(true);
    await evaluationService.loadNextPair();
    setIsLoading(false);
  };

  if (skipTutorial && isInTutorialMode) {
    loadNext();
  }

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
      setIsCameraControlsExpanded(false);
      setIsLoading(true);
      if (!isLoading && isRatingReady && !isFinished) {
        if (!isInTutorialMode) {
          await evaluationService.submitRating(ratingProvider.getRating());
        }

        if (nPairsRated >= 5) {
          setIsFinished(true);
        } else {
          await evaluationService.loadNextPair();
        }

        if (!isInTutorialMode) {
          setNPairsRated((prev) => ++prev);
        }

        setIsLoading(false);
        setFirstRating(null);
        setSecondRating(null);
        setShowFirstModel(true);
      }
    },
    isInTutorialMode,
    nPairsRated,
    isFinished,
    restartEvaluation: async () => {
      if (isFinished) {
        setIsLoading(true);
        setNPairsRated(0);

        await evaluationService.loadNextPair();
        setIsLoading(false);
        setIsFinished(false);
      }
    },
    isCameraControlsExpanded,
    setIsCameraControlsExpanded,
  };
};
