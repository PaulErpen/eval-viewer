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
      pair_id: modelObject.pairId,
      rating: modelObject.rating,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>,
    _options?: SnapshotOptions
  ): Rating {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      userId: data.user_id,
      pairId: data.pair_id,
      rating: data.rating,
    };
  },
};
