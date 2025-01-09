import { GSViewer } from "../gs-viewer/gs-viewer";
import "./eval-handler.scss";
import { IQASelect } from "../iqa-select/iqa-select";
import { useEvaluationHook } from "../../hooks/use-evaluation-service";

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
  } = useEvaluationHook();

  return (
    <div className="eval-handler">
      {!isLoading && firstPlyUrl !== null && secondPlyUrl !== null && (
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
        />
      )}

      <div
        className="tutorial-header"
        style={{ display: isInTutorialMode ? "block" : "none" }}
      >
        Tutorial
      </div>

      <div className="ui-container">
        <div className="button-container">
          <button
            className="switch"
            onClick={toggleModels}
            disabled={isLoading}
          >
            Switch model
          </button>
          <button
            className="next"
            onClick={loadNextPair}
            disabled={isLoading || !isRatingReady}
          >
            Load next
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
    </div>
  );
};
