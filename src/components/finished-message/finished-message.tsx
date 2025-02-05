import { FaRotate } from "react-icons/fa6";

export interface FinishedMessageProps {
    restartEvaluation: () => void;
    isFinished: boolean;
    isLoading: boolean;
}

export const FinishedMessage = ({restartEvaluation. isFinished, isLoading}: FinishedMessageProps) => {
  return (
    <div className="finished-message">
      <span>Thanks for participating in the evaluation ❤️</span>
      <button
        className="restart"
        onClick={restartEvaluation}
        disabled={!isFinished && !isLoading}
      >
        <FaRotate />
        <span>Start new evaluation</span>
      </button>
    </div>
  );
};
