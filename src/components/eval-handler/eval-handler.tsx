import { GSViewer } from "../gs-viewer/gs-viewer";
import "./eval-handler.scss";
import { IQASelect } from "../iqa-select/iqa-select";
import { useEvaluationHook } from "../../hooks/use-evaluation-service";
import { FaAnglesRight, FaRotate } from "react-icons/fa6";
import { CameraControlsPanel } from "../camera-controls-panel/camera-controls-panel";
import { ModelLozenge } from "../lozenge/model-lozenge";
import { FinishedMessage } from "../finished-message/finished-message";
import { TutorialMessage } from "../tutorial-message/tutorial-message";

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
    invertControls,
    setInvertControls,
    userId,
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
          invertControls={invertControls}
          isFinished={isFinished}
        />
      )}

      <TutorialMessage />

      {!isFinished && (
        <div className="header-container">
          {isInTutorialMode && <span className="header">Tutorial</span>}
          {!isInTutorialMode && (
            <span className="header">{nPairsRated}/6 pairs rated</span>
          )}
          <br />
          <span className="header-model-hint">
            {showFirstModel && <span style={{ color: "#d21400" }}>A</span>}
            {!showFirstModel && <span style={{ color: "#243cbf" }}>B</span>}
          </span>
        </div>
      )}

      {isFinished && (
        <FinishedMessage
          restartEvaluation={restartEvaluation}
          isFinished={isFinished}
          isLoading={isLoading}
          userId={userId}
        />
      )}

      {isLoading && (
        <div className="loading-message-container">
          <div className="loading-spinner-container">
            <div className="loading-spinner">
              <img src="/spinner.png" />
            </div>
          </div>
          <div className="loading-message">
            Determining optimal next comparison. <br />
            Please wait...
          </div>
        </div>
      )}

      {!isFinished && (
        <div className="ui-container-wrapper">
          <div className="camera-controls-wrapper">
            <CameraControlsPanel
              isExpanded={isCameraControlsExpanded}
              setExpanded={setIsCameraControlsExpanded}
              invertControls={invertControls}
              setInvertControls={setInvertControls}
            />
          </div>

          <div className="ui-container">
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
            <div className="select-container">
              <IQASelect
                fieldName="rating"
                value={rating}
                setValue={setRating}
                disabled={!seenBothModels || isLoading}
                showFirstModel={showFirstModel}
              />
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
