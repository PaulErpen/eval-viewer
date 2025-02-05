import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { UserSurvey } from "../model/user-survey";

export const userSurveyConverter: FirestoreDataConverter<UserSurvey> = {
  toFirestore: function (
    modelObject: WithFieldValue<UserSurvey>
  ): WithFieldValue<DocumentData> {
    return {
      age: modelObject.age,
      gender: modelObject.gender,
      education_level: modelObject.educationLevel,
      job_field: modelObject.jobField,
      previous_experience_3D: modelObject.previousExperience3D,
      color_blindness: modelObject.colorBlindness,
      visually_impaired: modelObject.visuallyImpaired,
      free_text: modelObject.freeTextFeedback,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>,
    _options?: SnapshotOptions
  ): UserSurvey {
    const data = snapshot.data();
    return {
      age: data.age,
      gender: data.gender,
      educationLevel: data.education_level,
      jobField: data.job_field,
      previousExperience3D: data.previous_experience_3D,
      colorBlindness: data.color_blindness,
      visuallyImpaired: data.visually_impaired,
      freeTextFeedback: data.free_text,
    };
  },
};
