import { GSViewer } from "../gs-viewer/gs-viewer";

export const EvalHandler = () => {
  return (
    <div className="eval-handler">
      <GSViewer plyPath="mcmc-vsc-truck-low-4_model.ply" />
    </div>
  );
};
