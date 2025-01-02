import { useRef, useState } from "react";
import { GSViewer } from "../gs-viewer/gs-viewer";
import { EvaluationServiceImpl } from "../../service/evaluation-service";
import { useFirebaseContext } from "../../context/firebase-context";
import { RepositoryImpl } from "../../repository/repository";
import { Pair } from "../../model/pair";
import {
  getAuth,
  GoogleAuthProvider,
  // signInWithRedirect,
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

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
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

    console.log("User has role " + tokenResult.claims.role);

    setIsOwner(tokenResult.claims.role === "admin");
  } catch (error) {
    console.error("Could get user token id for roles verification:", error);
  }
};

export const EvalHandler = () => {
  const firebaseApp = useFirebaseContext();
  const evalServiceRef = useRef(
    new EvaluationServiceImpl(new RepositoryImpl(firebaseApp))
  );
  const [pair, setPair] = useState<Pair | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  if (evalServiceRef.current.getCurrentUserId() == null) {
    evalServiceRef.current.createUserId();
  }

  if (pair == null) {
    setNextPair(pair, setPair, evalServiceRef.current.getNextPair);
  }

  if (user == null) {
    auth.onAuthStateChanged((user: User | null) => {
      console.log("Auth state changed");
      if (user != null) {
        setUser(user);
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
