import { GSViewer } from "../gs-viewer/gs-viewer";
import "./eval-handler.scss";
import { IQASelect } from "../iqa-select/iqa-select";
import { useEvaluationHook } from "../../hooks/use-evaluation-service";
import { FaAnglesRight, FaRotate } from "react-icons/fa6";
import { CameraControlsPanel } from "../camera-controls-panel/camera-controls-panel";
import { ModelLozenge } from "../lozenge/model-lozenge";

export const EvalHandler = () => {
  const {
    isLoading,
    showFirstModel,
    toggleModels,
    firstPlyUrl,
    secondPlyUrl,
    currentPair,
    isRatingReady,
    rating,
    setRating,
    loadNextPair,
    isInTutorialMode,
    nPairsRated,
    isFinished,
    restartEvaluation,
    isCameraControlsExpanded,
    setIsCameraControlsExpanded,
    seenBothModels,
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
        <div className="header-container">
          {isInTutorialMode && <span className="header">Tutorial</span>}
          {!isInTutorialMode && (
            <span className="header">{nPairsRated}/6 pairs rated</span>
          )}
          <div>
            Displaying: {<ModelLozenge showFirstModel={showFirstModel} />}
          </div>
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
        <div className="ui-container-wrapper">
          <div className="camera-controls-wrapper">
            <CameraControlsPanel
              isExpanded={isCameraControlsExpanded}
              setExpanded={setIsCameraControlsExpanded}
            />
          </div>

          <div className="ui-container">
            <div className="select-container">
              <IQASelect
                fieldName="rating"
                value={rating}
                setValue={setRating}
                disabled={!seenBothModels}
              />
            </div>
            <div className="switch-container">
              <ModelLozenge showFirstModel={showFirstModel} />
              <button
                className="switch"
                onClick={toggleModels}
                disabled={isLoading}
              >
                <FaRotate />
                <span>Switch model</span>
              </button>
            </div>
            <button
              className="next"
              onClick={loadNextPair}
              disabled={isLoading || !isRatingReady}
            >
              <FaAnglesRight />
              <span>Load next</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
