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

  return (
    <div className="eval-handler">
      {!isLoading && firstPlyUrl !== null && (
        <GSViewer plyPath={firstPlyUrl} hideModel={hideFirstModel} />
      )}

      {!isLoading && secondPlyUrl !== null && (
        <GSViewer plyPath={secondPlyUrl} hideModel={hideSecondModel} />
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
