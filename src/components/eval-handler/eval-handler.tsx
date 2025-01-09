import { useState } from "react";
import { GSViewer } from "../gs-viewer/gs-viewer";
import { useServiceContext } from "../../context/service-context";
import "./eval-handler.scss";
import { IQASelect } from "../iqa-select/iqa-select";

export const EvalHandler = () => {
  const { evaluationService } = useServiceContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFirstModel, setShowFirstModel] = useState<boolean>(false);

  evaluationService.connectLoadingState(setIsLoading);

  if (evaluationService.getCurrentPair() === null && !isLoading) {
    evaluationService.loadNextPair();
  }

  const firstPlyUrl = evaluationService.getFirstPlyUrl();
  const secondPlyUrl = evaluationService.getSecondPlyUrl();
  const currentPair = evaluationService.getCurrentPair();

  return (
    <div className="eval-handler">
      {!isLoading && firstPlyUrl !== null && secondPlyUrl !== null && (
        <GSViewer
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

      <div className="ui-container">
        <button
          className="switch"
          onClick={() => {
            setShowFirstModel((prev) => !prev);
          }}
        >
          Switch model
        </button>
        <IQASelect
          title={"Model A"}
          fieldName="model_1"
          value={null}
          setValue={() => {}}
          disabled={!showFirstModel}
        />
        <IQASelect
          title={"Model B"}
          fieldName="model_2"
          value={null}
          setValue={() => {}}
          disabled={showFirstModel}
        />
      </div>
    </div>
  );
};
