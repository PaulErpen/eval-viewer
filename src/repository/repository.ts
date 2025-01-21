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
  doc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { Pair } from "../model/pair";
import { Rating } from "../model/rating";
import { pairConverter } from "./pair-converter";
import { ratingConverter } from "./rating-converter";

export interface Repository {
  getNextPair: (
    getHighDetailModel: boolean,
    previousDataset: string,
    previousPreviousDataset: string
  ) => Promise<Pair>;
  ratePair: (pair: Pair, rating: Rating) => Promise<void>;
  submitRating: (rating: Rating) => Promise<void>;
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
  submitRating = async (rating: Rating) => {
    const ratings = collection(this.db, "rating").withConverter(
      ratingConverter
    );

    const pair = doc(this.db, "pair", rating.pairId).withConverter(
      pairConverter
    );
    updateDoc(pair, {
      n_ratings: increment(1),
    });

    const ratingDoc = doc(ratings);

    return setDoc(ratingDoc, rating);
  };

  getNextPair = async (
    getHighDetailModel: boolean,
    previousDataset: string,
    previousPreviousDataset: string
  ) => {
    const pairs = collection(this.db, "pair").withConverter(pairConverter);
    const highDetailConstraint = where("high_detail", "==", getHighDetailModel);
    const notInPreviousDataset = where("dataset_name", "not-in", [
      previousDataset,
      previousPreviousDataset,
    ]);
    const orderByRatings = orderBy("n_ratings", "asc");
    const limit1 = limit(1);

    const pairQuery = query(
      pairs,
      highDetailConstraint,
      orderByRatings,
      notInPreviousDataset,
      limit1
    );

    const result = await getDocs(pairQuery);

    if (result.docs.length == 0) {
      throw new Error("No docs found, this should not happen!");
    }

    return result.docs[0].data();
  };

  ratePair = async (_pair: Pair, _rating: Rating) => {};
}
