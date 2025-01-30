import { FirebaseApp } from "firebase/app";
import {
  Firestore,
  getFirestore,
  collection,
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
    previousDataset: string,
    previousPreviousDataset: string,
    previousSize: string,
    previousPreviousSize: string
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
    previousDataset: string,
    previousPreviousDataset: string,
    previousSize: string,
    previousPreviousSize: string
  ) => {
    const response = await fetch(
      "https://us-east1-gs-on-a-budget.cloudfunctions.net/get_next_pair",
      {
        method: "POST",
        body: JSON.stringify({
          previous_dataset: previousDataset,
          previous_previous_dataset: previousPreviousDataset,
          previous_model_size: previousSize,
          previous_previous_model_size: previousPreviousSize,
        }),
      }
    );

    const body = await response.json();

    const nPairs: number = body["pairs"].length();

    return body["pairs"][Math.round(Math.random() * (nPairs - 1))];
  };

  ratePair = async (_pair: Pair, _rating: Rating) => {};
}
