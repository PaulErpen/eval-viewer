import { GSViewer } from "../gs-viewer/gs-viewer";
import "./eval-handler.scss";
import { IQASelect } from "../iqa-select/iqa-select";
import { useEvaluationHook } from "../../hooks/use-evaluation-service";
import { FaAnglesRight, FaRotate } from "react-icons/fa6";

export const EvalHandler = () => {
  const {
    isLoading,
    showFirstModel,
    toggleModels,
    firstPlyUrl,
    secondPlyUrl,
    currentPair,
    isRatingReady,
    firstRating,
    setFirstRating,
    secondRating,
    setSecondRating,
    loadNextPair,
    isInTutorialMode,
    nPairsRated,
    isFinished,
    restartEvaluation,
  } = useEvaluationHook(false);

  return (
    <div className="eval-handler">
      {!isFinished && (
        <GSViewer
          isServiceLoading={isLoading}
          plyPath1={firstPlyUrl}
          plyPath2={secondPlyUrl}
          showFirst={showFirstModel}
          rotation_w={currentPair ? currentPair.rotation[0] : 0}
          rotation_qx={currentPair ? currentPair.rotation[1] : 0}
          rotation_qy={currentPair ? currentPair.rotation[2] : 0}
          rotation_qz={currentPair ? currentPair.rotation[3] : 0}
          position_x={currentPair ? currentPair.position[0] : 0}
          position_y={currentPair ? currentPair.position[1] : 0}
          position_z={currentPair ? currentPair.position[2] : 0}
          fovY={currentPair ? currentPair.fovY : 1}
          aspect={currentPair ? currentPair.aspect : 1}
          initialDistance={currentPair ? currentPair.initialDistance : 1}
        />
      )}

      {!isFinished && (
        <div className="header">
          {isInTutorialMode && <span>Tutorial</span>}
          {!isInTutorialMode && <span>{nPairsRated}/6 pairs rated</span>}
        </div>
      )}

      {isFinished && (
        <div className="finished-message">
          <span>Thanks for participating in the evaluation ❤️</span>
          <button
            className="restart"
            onClick={restartEvaluation}
            disabled={!isFinished && !isLoading}
          >
            <FaRotate />
            <span>Start new evaluation</span>
          </button>
        </div>
      )}

      {!isFinished && (
        <div className="ui-container">
          <div className="button-container">
            <button
              className="switch"
              onClick={toggleModels}
              disabled={isLoading}
            >
              <FaRotate />
              <span>Switch model</span>
            </button>
            <button
              className="next"
              onClick={loadNextPair}
              disabled={isLoading || !isRatingReady}
            >
              <FaAnglesRight />
              <span>Load next</span>
            </button>
          </div>
          <IQASelect
            title={"Model A"}
            fieldName="model_1"
            value={firstRating}
            setValue={setFirstRating}
            disabled={!showFirstModel}
          />
          <IQASelect
            title={"Model B"}
            fieldName="model_2"
            value={secondRating}
            setValue={setSecondRating}
            disabled={showFirstModel}
          />
        </div>
      )}
    </div>
  );
};
