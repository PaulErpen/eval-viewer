import { Pair } from "../model/pair";
import { Repository } from "../repository/repository";
import { generateUUID } from "./helpers/generate-uuid";
import { DownloadUrlProvider } from "./helpers/download-url-provider";
import { Rating } from "../model/rating";

const USER_ID_LOCAL_STORAGE_KEY = "USER_ID_LOCAL_STORAGE_KEY";

export interface EvaluationService {
  isInTutorialMode: () => boolean;
  getCurrentUserId: () => string | null;
  getCurrentPair: () => Pair | null;
  loadNextPair: () => Promise<void>;
  submitRating: (rating: Rating) => Promise<void>;
  getPlyUrls: () => Promise<{
    plyUrl1: string;
    plyUrl2: string;
  }>;
}

export class EvaluationServiceImpl implements EvaluationService {
  private tutorial: boolean;
  repository: Repository;
  currentPair: Pair;
  getDownloadUrl: DownloadUrlProvider;

  constructor(repository: Repository, getDownloadUrl: DownloadUrlProvider) {
    this.tutorial = true;
    this.repository = repository;
    this.getDownloadUrl = getDownloadUrl;
    this.currentPair = {
      id: "tutorial",
      model1: "tutorial/lego-mcmc-small.ksplat",
      model2: "tutorial/lego-default-big.ksplat",
      highDetail: false,
      nRatings: 0,
      rotation: [0.7071067811865476, 0.0, 0.0, -0.7071067811865475],
      position: [0.0, 0.0, 0.0],
    };

    this.createUserId();
  }

  getPlyUrls = async () => {
    const [plyUrl1, plyUrl2] = await Promise.all([
      this.getDownloadUrl(this.currentPair.model1),
      this.getDownloadUrl(this.currentPair.model2),
    ]);

    return {
      plyUrl1,
      plyUrl2,
    };
  };

  isInTutorialMode = () => {
    return this.tutorial;
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
    const wasInTutorialMode = this.tutorial;
    this.tutorial = false;
    const userId = this.getCurrentUserId();

    if (!userId) {
      throw new Error("No user id initialized! Illegal state!");
    }

    return new Promise<void>(async (resolve, reject) => {
      try {
        const previousModelType = wasInTutorialMode
          ? Math.random() <= 0.5
          : this.currentPair.highDetail;
        this.currentPair = await this.repository.getNextPair(
          !previousModelType
        );

        resolve();
      } catch (e) {
        console.error(e);
        reject();
      }
    });
  };

  submitRating = (rating: Rating) => {
    return this.repository.submitRating(rating);
  };
}
