import { Pair } from "../model/pair";
import { Repository } from "../repository/repository";
import { generateUUID } from "./helpers/generate-uuid";
import { DownloadUrlProvider } from "./helpers/download-url-provider";
import { Rating } from "../model/rating";
import {
  fillPreviousDatasets,
  fillPreviousSizes,
} from "./helpers/previous-values/previous-values";

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
  previousPair: Pair | null;
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
      fovY: 75,
      aspect: 2,
      initialDistance: 2,
      datasetName: "tutorial",
    };
    this.previousPair = null;

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
    this.tutorial = false;
    const userId = this.getCurrentUserId();

    if (!userId) {
      throw new Error("No user id initialized! Illegal state!");
    }

    return new Promise<void>(async (resolve, reject) => {
      try {
        const [firstDataset, secondDataset] = fillPreviousDatasets(
          this.currentPair ? this.currentPair.datasetName : null,
          this.previousPair ? this.previousPair.datasetName : null
        );
        const [firstSize, secondSize] = fillPreviousSizes(
          this.currentPair ? this.currentPair.size : null,
          this.previousPair ? this.previousPair.size : null
        );

        const newPair = await this.repository.getNextPair(
          firstDataset,
          secondDataset,
          firstSize,
          secondSize
        );

        this.previousPair = this.currentPair;
        this.currentPair = newPair;

        console.log(`Model A: ${this.currentPair.model1}`);
        console.log(`Model B: ${this.currentPair.model2}`);

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
