import { FaX } from "react-icons/fa6";
import "./tutorial-message.scss";
import { useState } from "react";

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
        <img src="./tutorial-message.png" />
        <div className="begin-wrapper">
          <button onClick={() => setIsOpen(false)}>Begin Survey</button>
        </div>
      </div>
    </div>
  );
};
