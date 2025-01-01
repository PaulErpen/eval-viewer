import { useRef, useState } from "react";
import { GSViewer } from "../gs-viewer/gs-viewer";
import { EvaluationServiceImpl } from "../../service/evaluation-service";
import { useFirebaseContext } from "../../context/firebase-context";
import { RepositoryImpl } from "../../repository/repository";
import { Pair } from "../../model/pair";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  User,
} from "firebase/auth";

// const setNextPair = async (
//   previousPair: Pair | null,
//   setPair: React.Dispatch<React.SetStateAction<Pair | null>>,
//   getNextPair: (previousPair: Pair | null) => Promise<Pair | null>
// ) => {
//   const nextPair = await getNextPair(previousPair);
//   setPair(nextPair);
// };

const auth = getAuth();

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

const loadAuthInfo = async (
  user: User,
  setIsOwner: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const tokenResult = await user.getIdTokenResult();

    setIsOwner(!!tokenResult.claims["owner"]);
  } catch (error) {
    console.error("Could get user token id for roles verification:", error);
  }
};

export const EvalHandler = () => {
  const firebaseApp = useFirebaseContext();
  const evalServiceRef = useRef(
    new EvaluationServiceImpl(new RepositoryImpl(firebaseApp))
  );
  const [pair, _setPair] = useState<Pair | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  if (evalServiceRef.current.getCurrentUserId() == null) {
    evalServiceRef.current.createUserId();
  }

  if (pair == null) {
    // setNextPair(pair, setPair, evalServiceRef.current.getNextPair);
  }

  if (user == null) {
    auth.onAuthStateChanged((user: User | null) => {
      setUser(user);

      if (user != null) {
        loadAuthInfo(user, setIsOwner);
      }
    });
  }

  return (
    <div className="eval-handler">
      {pair && <GSViewer plyPath={pair.model1} />}
      <button
        disabled={user == null || !isOwner}
        onClick={evalServiceRef.current.reset}
      >
        Reset
      </button>
      <button disabled={user != null} onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};
