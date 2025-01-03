import { useState } from "react";
import { GSViewer } from "../gs-viewer/gs-viewer";
import { useServiceContext } from "../../context/service-context";

export const EvalHandler = () => {
  const { evaluationService } = useServiceContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  evaluationService.connectLoadingState(setIsLoading);

  if (evaluationService.getCurrentPair() === null && !isLoading) {
    evaluationService.loadNextPair();
  }

  const plyUrl = evaluationService.getFirstPlyUrl();

  return (
    <div className="eval-handler">
      {!isLoading && plyUrl !== null && <GSViewer plyPath={plyUrl} />}
    </div>
  );
};
