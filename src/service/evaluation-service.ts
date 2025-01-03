import { Pair } from "../model/pair";
import { Repository } from "../repository/repository";
import { generateUUID } from "./helpers/generate-uuid";
import { DownloadUrlProvider } from "./helpers/download-url-provider";

const USER_ID_LOCAL_STORAGE_KEY = "USER_ID_LOCAL_STORAGE_KEY";

export interface EvaluationService {
  getCurrentUserId: () => string | null;
  loadNextPair: (previousPair: Pair | null) => Promise<void>;
  getFirstPlyUrl: () => string;
  getSecondPlyUrl: () => string;
}

export class EvaluationServiceImpl implements EvaluationService {
  repository: Repository;
  currentPair: Pair | null;
  isLoading: boolean;
  private firstPlyUrl: string;
  private secondPlyUrl: string;
  getDownloadUrl: DownloadUrlProvider;

  constructor(repository: Repository, getDownloadUrl: DownloadUrlProvider) {
    this.repository = repository;
    this.currentPair = null;
    this.isLoading = false;

    this.firstPlyUrl = "";
    this.secondPlyUrl = "";

    this.getDownloadUrl = getDownloadUrl;

    this.createUserId();
  }

  private createUserId = () => {
    const userId = crypto.randomUUID ? crypto.randomUUID() : generateUUID();

    localStorage.setItem(USER_ID_LOCAL_STORAGE_KEY, userId);

    return userId;
  };

  getCurrentUserId = () => {
    return localStorage.getItem(USER_ID_LOCAL_STORAGE_KEY);
  };

  loadNextPair = () => {
    const userId = this.getCurrentUserId();

    if (!userId) {
      throw new Error("No user id initialized! Illegal state!");
    }

    this.isLoading = true;

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
        this.isLoading = false;
        reject();
      }
    });
  };

  getFirstPlyUrl = () => {
    if (this.isLoading) {
      throw new Error("Can't retrieve ply url while loading!");
    }
    return this.firstPlyUrl;
  };

  getSecondPlyUrl = () => {
    if (this.isLoading) {
      throw new Error("Can't retrieve ply url while loading!");
    }
    return this.secondPlyUrl;
  };
}
