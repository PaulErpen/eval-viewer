import { Pair } from "../model/pair";
import { Repository } from "../repository/repository";

const USER_ID_LOCAL_STORAGE_KEY = "USER_ID_LOCAL_STORAGE_KEY";

export interface EvaluationService {
  createUserId: () => string;
  getCurrentUserId: () => string | null;
  getNextPair: (previousPair: Pair | null) => Promise<Pair | null>;
}

export class EvaluationServiceImpl implements EvaluationService {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  createUserId = () => {
    const userId = crypto.randomUUID ? crypto.randomUUID() : generateUUID();

    localStorage.setItem(USER_ID_LOCAL_STORAGE_KEY, userId);

    return userId;
  };

  getCurrentUserId = () => {
    return localStorage.getItem(USER_ID_LOCAL_STORAGE_KEY);
  };

  getNextPair = async (previousPair: Pair | null) => {
    const userId = this.getCurrentUserId();

    if (userId) {
      const previousModelType =
        previousPair != null ? !previousPair.highDetail : Math.random() <= 0.5;
      return this.repository.getNextPair(previousModelType);
    }

    return null;
  };
}

// source: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
function generateUUID() {
  // Public Domain/MIT
  console.error(
    "Secure context unavailable. Generating date based uuid for user! This is strongly discouraged."
  );
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
