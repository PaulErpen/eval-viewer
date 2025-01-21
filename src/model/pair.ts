export interface Pair {
  id: string;
  model1: string;
  model2: string;
  highDetail: boolean;
  nRatings: number;
  rotation: Array<number>;
  position: Array<number>;
  fovY: number;
  aspect: number;
  initialDistance: number;
  datasetName: string;
}
