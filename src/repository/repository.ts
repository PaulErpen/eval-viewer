import {
  httpsCallable,
  getFunctions,
  connectFunctionsEmulator,
} from "firebase/functions";

export class Repository {
  callHelloWorld = () => {
    const functions = getFunctions();

    if (import.meta.env.MODE == "development") {
      connectFunctionsEmulator(functions, "localhost", 5001);
    }

    const helloWorld = httpsCallable(functions, "helloWorld");

    return helloWorld();
  };
}
