import { GSViewer } from "./components/gs-viewer/gs-viewer";
import "./App.scss";
import { useEffect } from "react";
import { Repository } from "./repository/repository";
import { initializeFirebase } from "./initialize-firebase";

export const App = () => {
  useEffect(() => {
    initializeFirebase();

    new Repository().callHelloWorld();
  }, []);

  return (
    <div className="app-container">
      <GSViewer plyPath="mcmc-vsc-truck-low-4_model.ply" />
    </div>
  );
};
