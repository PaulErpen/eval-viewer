import { GSViewer } from "./components/gs-viewer/gs-viewer";
import "./App.scss";

export const App = () => {
  return (
    <div className="app-container">
      <GSViewer plyPath="mcmc-vsc-truck-low-4_model.ply" />
    </div>
  );
};
