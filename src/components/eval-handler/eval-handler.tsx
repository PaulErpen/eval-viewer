import { useState } from "react";
import { GSViewer } from "../gs-viewer/gs-viewer";
import { useServiceContext } from "../../context/service-context";
import "./eval-handler.scss";

export const EvalHandler = () => {
  const { evaluationService } = useServiceContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hideFirstModel, setHideFirstModel] = useState<boolean>(false);
  const [hideSecondModel, setHideSecondModel] = useState<boolean>(true);

  evaluationService.connectLoadingState(setIsLoading);

  if (evaluationService.getCurrentPair() === null && !isLoading) {
    evaluationService.loadNextPair();
  }

  const firstPlyUrl = evaluationService.getFirstPlyUrl();
  const secondPlyUrl = evaluationService.getSecondPlyUrl();
  const currentPair = evaluationService.getCurrentPair();

  return (
    <div className="eval-handler">
      {!isLoading && firstPlyUrl !== null && (
        <GSViewer
          plyPath={firstPlyUrl}
          hideModel={hideFirstModel}
          rotation_w={currentPair ? currentPair.rotation[0] : 0}
          rotation_qx={currentPair ? currentPair.rotation[1] : 0}
          rotation_qy={currentPair ? currentPair.rotation[2] : 0}
          rotation_qz={currentPair ? currentPair.rotation[3] : 0}
          position_x={currentPair ? currentPair.position[0] : 0}
          position_y={currentPair ? currentPair.position[1] : 0}
          position_z={currentPair ? currentPair.position[2] : 0}
        />
      )}

      {!isLoading && secondPlyUrl !== null && (
        <GSViewer
          plyPath={secondPlyUrl}
          hideModel={hideSecondModel}
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
            setHideFirstModel((prev) => !prev);
            setHideSecondModel((prev) => !prev);
          }}
        >
          Switch model
        </button>
      </div>
    </div>
  );
};
