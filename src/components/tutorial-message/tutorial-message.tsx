import { FaAnglesRight, FaRotate, FaX } from "react-icons/fa6";
import "./tutorial-message.scss";
import { useState } from "react";
import { ModelLozenge } from "../lozenge/model-lozenge";

export const TutorialMessage = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className="tutorial-message-wrapper"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="tutorial-message-body">
        <h2>Survey - Gaussian Splatting on a budget</h2>
        <div className="close-button" onClick={() => setIsOpen(false)}>
          <FaX />
        </div>
        <div className="tutorial-message-list">
          <ul>
            <li>
              You will be presented with{" "}
              <b>pairs of 3D Gaussian Splatting Models</b>
            </li>
            <li>
              <b>Explore</b> the models using the <b>camera controls</b>
            </li>
            <li>
              <b>Toggle</b> models using{" "}
              <img src="/space-sm.png" className="inline-img" /> or{" "}
              <button className="switch">
                <FaRotate />
                <span>Switch model</span>
              </button>{" "}
              on the bottom right
            </li>
            <li>
              <b>Rate</b> which model you like best (
              <ModelLozenge showFirstModel={true} />,{" "}
              <ModelLozenge showFirstModel={false} /> or neither)
            </li>
            <li>
              <b>Proceed</b> to the next pair using{" "}
              <button>
                <FaAnglesRight />
                <span>Load next</span>
              </button>{" "}
            </li>
          </ul>
        </div>
        <div className="begin-wrapper">
          <button onClick={() => setIsOpen(false)}>Begin Survey</button>
        </div>
      </div>
    </div>
  );
};
