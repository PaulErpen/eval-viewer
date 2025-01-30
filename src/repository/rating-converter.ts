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
      dataset: modelObject.dataset,
      technique_1: modelObject.technique1,
      technique_2: modelObject.technique2,
      size: modelObject.size,
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
      dataset: data.dataset,
      technique1: data.technique_1,
      technique2: data.technique_2,
      size: data.size,
    };
  },
};
