import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { Rating } from "../model/rating";

export const ratingConverter: FirestoreDataConverter<Rating> = {
  toFirestore: function (
    modelObject: WithFieldValue<Rating>
  ): WithFieldValue<DocumentData> {
    return {
      user_id: modelObject.userId,
      rating_1: modelObject.rating1,
      rating_2: modelObject.rating2,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>,
    options?: SnapshotOptions
  ): Rating {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      userId: data.user_id,
      rating1: data.rating_1,
      rating2: data.rating_2,
    };
  },
};
