import { GSViewer } from "./components/gs-viewer/gs-viewer";
import "./App.scss";

export const App = () => {
  return (
    <div className="app-container">
      <GSViewer plyPath="ignatius-mcmc-1_427_672-no-downscale-with-sh-3_model.ply" />
    </div>
  );
};
