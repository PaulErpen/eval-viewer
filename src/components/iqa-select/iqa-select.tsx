import "./iqa-select.scss";

export interface IQASelectProps {
  title: string;
  fieldName: string;
  value: number | null;
  setValue: (value: number) => void;
  disabled: boolean;
}

export const IQASelect = ({
  title,
  fieldName,
  value,
  setValue,
  disabled,
}: IQASelectProps) => {
  return (
    <div className={"iqa-select" + (disabled ? " disabled" : "")}>
      <div className="iqa-select-title">{title}</div>
      <fieldset>
        <div
          onClick={() => {
            if (!disabled) {
              setValue(5);
            }
          }}
        >
          <input
            type="radio"
            id="5"
            name={fieldName}
            value="Excellent"
            checked={value === 5}
            disabled={disabled}
          />
          <label htmlFor="Excellent">Excellent</label>
        </div>
        <div
          onClick={() => {
            if (!disabled) {
              setValue(4);
            }
          }}
        >
          <input
            type="radio"
            id="4"
            name={fieldName}
            value="Good"
            checked={value === 4}
            disabled={disabled}
          />
          <label htmlFor="Good">Good</label>
        </div>
        <div
          onClick={() => {
            if (!disabled) {
              setValue(3);
            }
          }}
        >
          <input
            type="radio"
            id="3"
            name={fieldName}
            value="Fair"
            checked={value === 3}
            disabled={disabled}
          />
          <label htmlFor="Fair">Fair</label>
        </div>
        <div
          onClick={() => {
            if (!disabled) {
              setValue(2);
            }
          }}
        >
          <input
            type="radio"
            id="2"
            name={fieldName}
            value="Poor"
            checked={value === 2}
            disabled={disabled}
          />
          <label htmlFor="Poor">Poor</label>
        </div>
        <div
          onClick={() => {
            if (!disabled) {
              setValue(1);
            }
          }}
        >
          <input
            type="radio"
            id="1"
            name={fieldName}
            value="Bad"
            checked={value === 1}
            disabled={disabled}
          />
          <label htmlFor="Bad">Bad</label>
        </div>
      </fieldset>
    </div>
  );
};
