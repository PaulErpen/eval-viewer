import { Pair } from "../model/pair";
import { Repository } from "../repository/repository";
import { generateUUID } from "./helpers/generate-uuid";
import { DownloadUrlProvider } from "./helpers/download-url-provider";

const USER_ID_LOCAL_STORAGE_KEY = "USER_ID_LOCAL_STORAGE_KEY";

export interface EvaluationService {
  getCurrentUserId: () => string | null;
  getCurrentPair: () => Pair | null;
  loadNextPair: () => Promise<void>;
  getFirstPlyUrl: () => string | null;
  getSecondPlyUrl: () => string | null;
  connectLoadingState: (setStateAction: (loading: boolean) => void) => void;
}

export class EvaluationServiceImpl implements EvaluationService {
  repository: Repository;
  currentPair: Pair | null;
  private firstPlyUrl: string | null;
  private secondPlyUrl: string | null;
  getDownloadUrl: DownloadUrlProvider;
  setLoadingStateAction: (loading: boolean) => void = (_bool) => {};

  constructor(repository: Repository, getDownloadUrl: DownloadUrlProvider) {
    this.repository = repository;
    this.currentPair = null;

    this.firstPlyUrl = null;
    this.secondPlyUrl = null;

    this.getDownloadUrl = getDownloadUrl;

    this.createUserId();
  }

  connectLoadingState = (setStateAction: (loading: boolean) => void) => {
    this.setLoadingStateAction = setStateAction;
  };

  private createUserId = () => {
    const userId = crypto.randomUUID ? crypto.randomUUID() : generateUUID();

    localStorage.setItem(USER_ID_LOCAL_STORAGE_KEY, userId);

    return userId;
  };

  getCurrentUserId = () => {
    return localStorage.getItem(USER_ID_LOCAL_STORAGE_KEY);
  };

  getCurrentPair = () => {
    return this.currentPair;
  };

  loadNextPair = () => {
    const userId = this.getCurrentUserId();

    if (!userId) {
      throw new Error("No user id initialized! Illegal state!");
    }

    this.setLoadingStateAction(true);

    return new Promise<void>(async (resolve, reject) => {
      try {
        const previousModelType =
          this.currentPair != null
            ? !this.currentPair.highDetail
            : Math.random() <= 0.5;
        this.currentPair = await this.repository.getNextPair(previousModelType);

        const [plyUrl1, plyUrl2] = await Promise.all([
          this.getDownloadUrl(this.currentPair.model1),
          this.getDownloadUrl(this.currentPair.model2),
        ]);

        this.firstPlyUrl = plyUrl1;
        this.secondPlyUrl = plyUrl2;
        resolve();
      } finally {
        this.setLoadingStateAction(false);
        reject();
      }
    });
  };

  getFirstPlyUrl = () => {
    return this.firstPlyUrl;
  };

  getSecondPlyUrl = () => {
    return this.secondPlyUrl;
  };
}
