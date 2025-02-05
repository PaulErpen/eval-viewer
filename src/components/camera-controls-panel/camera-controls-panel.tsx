import "./camera-controls-panel.scss";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

export const CameraControlsPanel = ({
  isExpanded,
  setExpanded,
  invertControls,
  setInvertControls,
}: {
  isExpanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  invertControls: boolean;
  setInvertControls: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="camera-controls-panel">
      <span>
        <b>Controls</b>
      </span>
      <br />
      {isExpanded && (
        <>
          <br />
          <div>
            <div className="img-wrapper">
              <img src="/wasd.png" />
            </div>
            <span>to move the camera</span>
          </div>
          <div>
            <div className="img-wrapper">
              <img src="/left-click.png" />
            </div>
            <span>to rotate the camera</span>
          </div>
          <div>
            <div className="img-wrapper">
              <img src="/right-click.png" />
            </div>
            <span>to move vertically</span>
          </div>
          <div>
            <div className="img-wrapper">
              <img src="/scroll.png" />
            </div>
            <span>to zoom the camera</span>
          </div>
          <div>
            <div className="img-wrapper">
              <img src="/space.png" />
            </div>
            <span>to switch the models</span>
          </div>
          <div>
            <input
              type="checkbox"
              id="invertControls"
              name="invertControls"
              value="Bike"
              checked={invertControls}
              onChange={() => setInvertControls((prev) => !prev)}
            />
            <label htmlFor="invertControls"> Invert camera controls</label>
          </div>
        </>
      )}
      <button className="expand" onClick={() => setExpanded((prev) => !prev)}>
        {!isExpanded && <FaCaretDown />}
        {isExpanded && <FaCaretUp />}
      </button>
    </div>
  );
};
