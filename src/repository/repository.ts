import { FirebaseApp } from "firebase/app";
import {
  Firestore,
  getFirestore,
  collection,
  orderBy,
  getDocs,
  query,
  where,
  limit,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { Pair } from "../model/pair";
import { Rating } from "../model/rating";
import { pairConverter } from "./pair-converter";

export interface Repository {
  getNextPair: (getHighDetailModel: boolean) => Promise<Pair>;
  ratePair: (pair: Pair, rating: Rating) => Promise<void>;
  reset: () => Promise<void>;
}

export class RepositoryImpl implements Repository {
  private app: FirebaseApp;
  // private functions: Functions;
  private db: Firestore;

  constructor(app: FirebaseApp) {
    this.app = app;
    // this.functions = getFunctions(this.app);
    this.db = getFirestore(this.app);
  }

  getNextPair = async (getHighDetailModel: boolean) => {
    const pairs = collection(this.db, "pair").withConverter(pairConverter);
    const highDetailConstraint = where("high_detail", "==", getHighDetailModel);
    const orderByRatings = orderBy("n_ratings", "asc");
    const limit1 = limit(1);

    const pairQuery = query(
      pairs,
      highDetailConstraint,
      orderByRatings,
      limit1
    );

    const result = await getDocs(pairQuery);

    if (result.docs.length == 0) {
      throw new Error("No docs found, this should not happen!");
    }

    return result.docs[0].data();
  };

  ratePair = async (_pair: Pair, _rating: Rating) => {};

  reset = async () => {
    await this.clearCollection("pair");
    await this.clearCollection("rating");

    const pairs = collection(this.db, "pair").withConverter(pairConverter);
    addDoc(pairs, {
      id: "",
      model1: "mcmc-vsc-truck-low-4_model.ply",
      model2: "mcmc-vsc-truck-low-4_model.ply",
      highDetail: false,
      nRatings: 0,
    });
    addDoc(pairs, {
      id: "",
      model1: "mcmc-vsc-truck-low-4_model.ply",
      model2: "mcmc-vsc-truck-low-4_model.ply",
      highDetail: true,
      nRatings: 0,
    });
  };

  private async clearCollection(collectionName: string) {
    const pairs = collection(this.db, collectionName);
    const pairSnapshots = await getDocs(pairs);

    const deletePromises = pairSnapshots.docs.map((document) =>
      deleteDoc(doc(this.db, collectionName, document.id))
    );

    await Promise.all(deletePromises);
  }
}
