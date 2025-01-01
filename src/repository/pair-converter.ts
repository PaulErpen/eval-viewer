import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { Pair } from "../model/pair";

export const pairConverter: FirestoreDataConverter<Pair> = {
  toFirestore: function (
    modelObject: WithFieldValue<Pair>
  ): WithFieldValue<DocumentData> {
    return {
      model_1: modelObject.model1,
      model_2: modelObject.model2,
      high_detail: modelObject.highDetail,
      n_ratings: modelObject.nRatings,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>,
    _options?: SnapshotOptions
  ): Pair {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      model1: data.model_1,
      model2: data.model_2,
      highDetail: data.high_detail,
      nRatings: data.n_ratings,
    };
  },
};
