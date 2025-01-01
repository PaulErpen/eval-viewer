import { Pair } from "../model/pair";
import { Repository } from "../repository/repository";

const USER_ID_LOCAL_STORAGE_KEY = "USER_ID_LOCAL_STORAGE_KEY";

export interface EvaluationService {
  getCurrentUserId: () => string | null;
  getNextPair: (previousPair: Pair | null) => Promise<Pair | null>;
}

export class EvaluationServiceImpl implements EvaluationService {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

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
