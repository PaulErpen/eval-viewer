import { FirebaseApp } from "firebase/app";
import { useFirebaseContext } from "../../context/firebase-context";
import { Repository } from "../../repository/repository";
import { GSViewer } from "../gs-viewer/gs-viewer";

const callHelloWorld = async (app: FirebaseApp) => {
  const res = await new Repository(app)
    .callHelloWorld()
    .then((res) => console.log(res.data))
    .catch((error) => console.error(error));
  console.log("Response received!");
};

export const EvalHandler = () => {
  const app = useFirebaseContext();

  return (
    <div className="eval-handler" onClick={() => callHelloWorld(app)}>
      <GSViewer plyPath="mcmc-vsc-truck-low-4_model.ply" />
    </div>
  );
};
