import { FirebaseApp } from "firebase/app";
import {
  httpsCallable,
  getFunctions,
  connectFunctionsEmulator,
  Functions,
} from "firebase/functions";

export class Repository {
  private app: FirebaseApp;
  private functions: Functions;

  constructor(app: FirebaseApp) {
    this.app = app;
    this.functions = getFunctions(this.app);

    // if (import.meta.env.MODE == "development") {
    //   connectFunctionsEmulator(this.functions, "localhost", 5001);
    // }
  }

  callHelloWorld = () => {
    const helloWorld = httpsCallable(this.functions, "helloWorld");

    return helloWorld();
  };
}
