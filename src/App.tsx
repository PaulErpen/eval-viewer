import { GSViewer } from "./components/gs-viewer/gs-viewer";
import "./App.scss";

export const App = () => {
  return (
    <div className="app-container">
      <GSViewer plyPath="/home/paul/TUWien/MasterThesisNerf/repos/GaussianSplats3D/tests/example_splats/ignatius-mcmc-2-downscale-2-uncapped_model.ply" />
    </div>
  );
};

// <GSViewer plyPath="/home/paul/TUWien/MasterThesisNerf/repos/GaussianSplats3D/tests/example_splats/ignatius-3968-uncapped_model.ply" />
