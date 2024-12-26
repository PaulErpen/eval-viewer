import { GSViewer } from "./components/gs-viewer/gs-viewer";
import "./App.scss";

export const App = () => {
  return (
    <div className="app-container">
      <GSViewer plyPath="lego_default_big.ply" />
    </div>
  );
};
