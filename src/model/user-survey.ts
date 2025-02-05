import { EducationLevel } from "./education-level";

export interface UserSurvey {
  age: number;
  gender: "male" | "female" | "other";
  educationLevel: EducationLevel;
  jobField: string;
  previousExperience3D: "none" | "intermediate" | "expert";
  colorBlindness: boolean;
  visuallyImpaired: string;
  freeTextFeedback: string;
}
