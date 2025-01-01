import { Pair } from "../model/pair";
import { Repository } from "../repository/repository";

const USER_ID_LOCAL_STORAGE_KEY = "USER_ID_LOCAL_STORAGE_KEY";

export interface EvaluationService {
  getCurrentUserId: () => string | null;
  getNextPair: () => Promise<Pair | null>;
}

export class EvaluationServiceImpl implements EvaluationService {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  getCurrentUserId = () => {
    return localStorage.getItem(USER_ID_LOCAL_STORAGE_KEY);
  };

  getNextPair = async () => {
    const userId = this.getCurrentUserId();

    if (userId) {
    }

    return null;
  };
}
