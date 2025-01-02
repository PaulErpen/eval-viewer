import { useRef, useState } from "react";
import { GSViewer } from "../gs-viewer/gs-viewer";
import { EvaluationServiceImpl } from "../../service/evaluation-service";
import { useFirebaseContext } from "../../context/firebase-context";
import { RepositoryImpl } from "../../repository/repository";
import { Pair } from "../../model/pair";

const setNextPair = async (
  previousPair: Pair | null,
  setPair: React.Dispatch<React.SetStateAction<Pair | null>>,
  getNextPair: (previousPair: Pair | null) => Promise<Pair | null>
) => {
  const nextPair = await getNextPair(previousPair);
  setPair(nextPair);
};

export const EvalHandler = () => {
  const firebaseApp = useFirebaseContext();
  const evalServiceRef = useRef(
    new EvaluationServiceImpl(new RepositoryImpl(firebaseApp))
  );
  const [pair, setPair] = useState<Pair | null>(null);

  if (evalServiceRef.current.getCurrentUserId() == null) {
    evalServiceRef.current.createUserId();
  }

  if (pair == null) {
    setNextPair(pair, setPair, evalServiceRef.current.getNextPair);
  }

  return (
    <div className="eval-handler">
      {pair && <GSViewer plyPath={pair.model1} />}
    </div>
  );
};
