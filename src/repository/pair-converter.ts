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
      rotation: modelObject.rotation,
      position: modelObject.position,
      fov_y: modelObject.fovY,
      aspect: modelObject.aspect,
      initial_distance: modelObject.initialDistance,
      dataset_name: modelObject.datasetName,
      size: modelObject.size,
      technique_1: modelObject.technique1,
      technique_2: modelObject.technique2,
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
      rotation: data.rotation,
      position: data.position,
      fovY: data.fov_y,
      aspect: data.aspect,
      initialDistance: data.initial_distance,
      datasetName: data.dataset_name,
      size: data.size,
      technique1: data.technique_1,
      technique2: data.technique_2,
    };
  },
};
