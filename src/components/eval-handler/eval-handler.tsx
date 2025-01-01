import { useDeferredValue, useEffect, useRef, useState } from "react";
import { GSViewer } from "../gs-viewer/gs-viewer";
import { EvaluationServiceImpl } from "../../service/evaluation-service";
import { useFirebaseContext } from "../../context/firebase-context";
import { RepositoryImpl } from "../../repository/repository";
import { Pair } from "../../model/pair";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";

const setNextPair = async (
  previousPair: Pair | null,
  setPair: React.Dispatch<React.SetStateAction<Pair | null>>,
  getNextPair: (previousPair: Pair | null) => Promise<Pair | null>
) => {
  const nextPair = await getNextPair(previousPair);
  setPair(nextPair);
};

const auth = getAuth();

async function signInWithGoogle(
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>
) {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in with Google:", user);
    setUser(user);
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
}

const setOwner = async (
  setIsOwner: React.Dispatch<React.SetStateAction<boolean>>,
  user: User
) => {
  const tokenResult = await user.getIdTokenResult();

  setIsOwner(!!tokenResult.claims["owner"]);
};

export const EvalHandler = () => {
  const firebaseApp = useFirebaseContext();
  const evalServiceRef = useRef(
    new EvaluationServiceImpl(new RepositoryImpl(firebaseApp))
  );
  const [pair, setPair] = useState<Pair | null>(null);
  const [user, setUser] = useState<User | null>();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  if (evalServiceRef.current.getCurrentUserId() == null) {
    evalServiceRef.current.createUserId();
  }

  if (pair == null) {
    setNextPair(pair, setPair, evalServiceRef.current.getNextPair);
  }

  useEffect(() => {
    if (user) {
      setOwner(setIsOwner, user);
    }
  }, [user]);

  return (
    <div className="eval-handler">
      {pair && <GSViewer plyPath={pair.model1} />}
      <button
        disabled={user == null || !isOwner}
        onClick={evalServiceRef.current.reset}
      >
        Reset
      </button>
      <button
        disabled={user != null}
        onClick={async () => await signInWithGoogle(setUser)}
      >
        Sign in with Google
      </button>
    </div>
  );
};
