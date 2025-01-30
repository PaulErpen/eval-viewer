import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { RatingType } from "../../model/rating";
import { ModelLozenge } from "../lozenge/model-lozenge";
import "./iqa-select.scss";

export interface IQASelectProps {
  fieldName: string;
  value: RatingType | null;
  setValue: (value: RatingType) => void;
  disabled: boolean;
  showFirstModel: boolean;
}

export const IQASelect = ({
  fieldName,
  value,
  setValue,
  disabled,
  showFirstModel,
}: IQASelectProps) => {
  return (
    <div className={"iqa-select" + (disabled ? " disabled" : "")}>
      <div className="iqa-select-title">Which model do you prefer?</div>
      <fieldset>
        <div
          onClick={() => {
            if (!disabled) {
              setValue("first");
            }
          }}
        >
          <input
            type="radio"
            id="5"
            name={fieldName}
            value="Excellent"
            checked={value === "first"}
            disabled={disabled}
          />
          <label htmlFor="first">
            <ModelLozenge showFirstModel={true} />
            {showFirstModel && <FaEye />}
            {!showFirstModel && <FaEyeSlash />}
          </label>
        </div>
        <div
          onClick={() => {
            if (!disabled) {
              setValue("neither");
            }
          }}
        >
          <input
            type="radio"
            id="4"
            name={fieldName}
            value="neither"
            checked={value === "neither"}
            disabled={disabled}
          />
          <label htmlFor="Good">Neither</label>
        </div>
        <div
          onClick={() => {
            if (!disabled) {
              setValue("second");
            }
          }}
        >
          <input
            type="radio"
            id="3"
            name={fieldName}
            value="second"
            checked={value === "second"}
            disabled={disabled}
          />
          <label htmlFor="Fair">
            <ModelLozenge showFirstModel={false} />
            {!showFirstModel && <FaEye />}
            {showFirstModel && <FaEyeSlash />}
          </label>
        </div>
      </fieldset>
    </div>
  );
};
