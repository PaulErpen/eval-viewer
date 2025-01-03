import "./App.scss";
import { EvalHandler } from "./components/eval-handler/eval-handler";
import { ServiceContextProvider } from "./context/service-context";

export const App = () => {
  return (
    <div className="app-container">
      <ServiceContextProvider>
        <EvalHandler />
      </ServiceContextProvider>
    </div>
  );
};
