import { FaRotate } from "react-icons/fa6";
import { UserSurvey } from "../../model/user-survey";
import { useEffect, useState } from "react";
import { Nullable } from "../../model/nullable";
import { debounce } from "lodash";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useServiceContext } from "../../context/service-context";
import { userSurveyConverter } from "../../repository/user-survey-converter";
import { EducationLevel } from "../../model/education-level";
import "./finished-message.scss";

export interface FinishedMessageProps {
  restartEvaluation: () => void;
  isFinished: boolean;
  isLoading: boolean;
  userId: string | null;
}

const nullUserSurvey: Nullable<UserSurvey> = {
  age: null,
  gender: null,
  educationLevel: null,
  jobField: null,
  previousExperience3D: null,
  colorBlindness: null,
  visuallyImpaired: null,
  freeTextFeedback: null,
};

export const FinishedMessage = ({
  restartEvaluation,
  isFinished,
  isLoading,
  userId,
}: FinishedMessageProps) => {
  const { firebaseApp } = useServiceContext();
  const db = getFirestore(firebaseApp);

  const [userSurvey, setFormData] =
    useState<Nullable<UserSurvey>>(nullUserSurvey);

  useEffect(() => {
    if (userId) {
      const docRef = doc(db, "userSurvey", userId).withConverter(
        userSurveyConverter
      );

      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          setFormData({ ...nullUserSurvey, ...doc.data() });
        }
      });
    }
  }, [userId]);

  const debouncedUpdate = debounce(async (updatedData) => {
    if (userId) {
      const docRef = doc(db, "userSurvey", userId).withConverter(
        userSurveyConverter
      );
      await setDoc(docRef, updatedData, { merge: true });
    }
  }, 2000);

  const handleChange = (key: keyof UserSurvey, value: any) => {
    const newFormData = { ...userSurvey, [key]: value };
    setFormData(newFormData);
    debouncedUpdate(newFormData);
  };

  const formFinished = Object.values(userSurvey).every(
    (value) => value !== null && value !== undefined
  );

  return (
    <div className="finished-message">
      <h2>Thank you for participating ❤️</h2>
      <br />
      <span>Please fill in the details below.</span>
      <br />
      <span>All entered information is saved in real-time.</span>
      <br />
      <span></span>

      <div className="form">
        <div className="fieldSet">
          <label htmlFor="age">Age (in years)</label>{" "}
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={userSurvey.age ?? ""}
            onChange={(e) => handleChange("age", parseInt(e.target.value))}
          />
        </div>
        <div className="fieldSet">
          <label htmlFor="gender">Gender</label>{" "}
          <select
            id="gender"
            value={userSurvey.gender ?? ""}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option key=" " value=" ">
              {" "}
            </option>
            <option key="female" value="female">
              female
            </option>
            <option key="male" value="male">
              male
            </option>
            <option key="other" value="other">
              other
            </option>
          </select>
        </div>
        <div className="fieldSet">
          <label htmlFor="education">Education Level</label>{" "}
          <select
            id="education"
            value={userSurvey.educationLevel ?? ""}
            onChange={(e) => handleChange("educationLevel", e.target.value)}
          >
            <option key=" " value=" ">
              {" "}
            </option>
            {Object.values(EducationLevel).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="fieldSet">
          <label htmlFor="jobField">Job field (or field of study)</label>{" "}
          <input
            type="text"
            name="jobField"
            placeholder="Job field"
            value={userSurvey.jobField ?? ""}
            onChange={(e) => handleChange("jobField", e.target.value)}
          />
        </div>
        <div className="fieldSet">
          <label htmlFor="previousExperience3D">
            What's your experience level with 3D software?
          </label>{" "}
          <select
            id="previousExperience3D"
            value={userSurvey.previousExperience3D ?? ""}
            onChange={(e) =>
              handleChange("previousExperience3D", e.target.value)
            }
          >
            <option key=" " value=" ">
              {" "}
            </option>
            <option key="none" value="none">
              No experience
            </option>
            <option key="intermidiate" value="intermidiate">
              Some experience
            </option>
            <option key="expert" value="expert">
              Lots of experience
            </option>
          </select>
        </div>
        <div className="checkbox-fieldSet">
          <div>
            <input
              type="checkbox"
              checked={userSurvey.colorBlindness ?? false}
              name="colorBlindness"
              onChange={() =>
                handleChange("colorBlindness", !userSurvey.colorBlindness)
              }
            />
          </div>
          <label
            htmlFor="colorBlindness"
            onClick={() =>
              handleChange("colorBlindness", !userSurvey.colorBlindness)
            }
          >
            Check if you are color blind
          </label>
        </div>
        <div className="fieldSet">
          <label htmlFor="jobField">Any other visual impairments?</label>{" "}
          <input
            type="text"
            name="visuallyImpaired"
            placeholder="Visual impairments"
            value={userSurvey.visuallyImpaired ?? ""}
            onChange={(e) => handleChange("visuallyImpaired", e.target.value)}
          />
        </div>
        <div className="fieldSet">
          <label htmlFor="jobField">Any other feedback?</label>{" "}
          <textarea
            name="freeTextFeedback"
            placeholder="Feedback"
            value={userSurvey.freeTextFeedback ?? ""}
            onChange={(e) => handleChange("freeTextFeedback", e.target.value)}
            rows={4}
            cols={50}
          />
        </div>
      </div>

      <button
        className="restart"
        onClick={restartEvaluation}
        disabled={!isFinished || isLoading || !formFinished}
      >
        <FaRotate />
        <span>Start new evaluation</span>
      </button>
    </div>
  );
};
