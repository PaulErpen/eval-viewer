import "./App.scss";
import { EvalHandler } from "./components/eval-handler/eval-handler";
import { FirebaseContextProvider } from "./context/firebase-context";

export const App = () => {
  return (
    <div className="app-container">
      <FirebaseContextProvider>
        <EvalHandler />
      </FirebaseContextProvider>
    </div>
  );
};
