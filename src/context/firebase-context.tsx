import { createContext, PropsWithChildren, useContext } from "react";
import { initializeFirebase } from "./initialize-firebase";
import { FirebaseApp } from "firebase/app";

const firebaseApp = initializeFirebase();
const FirebaseContext = createContext<FirebaseApp>(firebaseApp);

export const FirebaseContextProvider = ({ children }: PropsWithChildren) => (
  <FirebaseContext.Provider value={firebaseApp}>
    {children}
  </FirebaseContext.Provider>
);

export const useFirebaseContext = () => useContext(FirebaseContext);
