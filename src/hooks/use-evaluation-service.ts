import { useEffect, useRef, useState } from "react";
import { useServiceContext } from "../context/service-context";
import { Pair } from "../model/pair";
import { RatingProviderImpl } from "../service/rating-provider/rating-provider";
import { RatingType } from "../model/rating";

export interface EvaluationHookResult {
  isLoading: boolean;
  showFirstModel: boolean;
  toggleModels: () => void;
  firstPlyUrl: string | null;
  secondPlyUrl: string | null;
  currentPair: Pair | null;
  isRatingReady: boolean;
  rating: RatingType | null;
  setRating: (rating: RatingType) => void;
  loadNextPair: () => void;
  isInTutorialMode: boolean;
  nPairsRated: number;
  isFinished: boolean;
  restartEvaluation: () => Promise<void>;
  isCameraControlsExpanded: boolean;
  setIsCameraControlsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  seenBothModels: boolean;
  invertControls: boolean;
  setInvertControls: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useEvaluationHook: (
  skipTutorial: boolean
) => EvaluationHookResult = (skipTutorial: boolean) => {
  const { evaluationService } = useServiceContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFirstModel, setShowFirstModel] = useState<boolean>(true);
  const [firstPlyUrl, setFirstPlyUrl] = useState<string | null>(null);
  const [secondPlyUrl, setSecondPlyUrl] = useState<string | null>(null);

  const [rating, setRating] = useState<RatingType | null>(null);
  const [nPairsRated, setNPairsRated] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [seenBothModels, setSeenBothModels] = useState<boolean>(false);
  const [invertControls, setInvertControls] = useState<boolean>(false);

  const [isCameraControlsExpanded, setIsCameraControlsExpanded] =
    useState(true);

  const pressedKeysRef = useRef<Set<string>>(new Set());

  const currentPair = evaluationService.getCurrentPair();
  const ratingProvider = new RatingProviderImpl(
    evaluationService.getCurrentUserId(),
    currentPair?.id ?? null,
    rating,
    currentPair?.datasetName ?? null,
    currentPair?.technique1 ?? null,
    currentPair?.technique2 ?? null,
    currentPair?.size ?? null
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

  evaluationService.getPlyUrls().then((result) => {
    if (result) {
      const { plyUrl1, plyUrl2 } = result;

      if (!isLoading) {
        if (plyUrl1 !== firstPlyUrl) {
          setFirstPlyUrl(plyUrl1);
        }
        if (plyUrl2 !== secondPlyUrl) {
          setSecondPlyUrl(plyUrl2);
        }
      }
    }
  });

  const toggleModels = () => {
    setSeenBothModels(true);
    setShowFirstModel((prev) => !prev);
  };

  useEffect(() => {
    const toggleOnSpacePressed = (event: KeyboardEvent) => {
      if (event.key == " ") {
        toggleModels();
      }
    };
    window.addEventListener("keydown", toggleOnSpacePressed);

    return () => {
      window.removeEventListener("keydown", toggleOnSpacePressed);
    };
  }, [toggleModels]);

  useEffect(() => {
    const skipShortcut = (event: KeyboardEvent) => {
      pressedKeysRef.current.add(event.key);

      if (
        pressedKeysRef.current.has("Alt") &&
        pressedKeysRef.current.has("Control") &&
        pressedKeysRef.current.has("p")
      ) {
        loadNext();
      }
    };
    window.addEventListener("keydown", skipShortcut);

    const removeKeys = (event: KeyboardEvent) => {
      pressedKeysRef.current.delete(event.key);
    };
    window.addEventListener("keyup", removeKeys);

    return () => {
      window.removeEventListener("keydown", skipShortcut);
      window.removeEventListener("keyup", removeKeys);
    };
  }, [loadNext]);

  return {
    isLoading,
    showFirstModel,
    toggleModels,
    firstPlyUrl,
    secondPlyUrl,
    currentPair,
    isRatingReady,
    rating,
    setRating,
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
        setRating(null);
        setSeenBothModels(false);
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

        evaluationService.reset();
        await evaluationService.loadNextPair();
        setIsLoading(false);
        setIsFinished(false);
      }
    },
    isCameraControlsExpanded,
    setIsCameraControlsExpanded,
    seenBothModels,
    invertControls,
    setInvertControls,
  };
};
