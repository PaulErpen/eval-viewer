import { createContext, PropsWithChildren, useContext } from "react";
import { initializeFirebase } from "./helpers/initialize-firebase";
import {
  EvaluationService,
  EvaluationServiceImpl,
} from "../service/evaluation-service";
import { RepositoryImpl } from "../repository/repository";
import { provideDownloadUrl } from "./helpers/provide-download-url";

export interface ServiceContext {
  evaluationService: EvaluationService;
}

const firebaseApp = initializeFirebase();
const serviceContextInstance = {
  evaluationService: new EvaluationServiceImpl(
    new RepositoryImpl(firebaseApp),
    provideDownloadUrl
  ),
};
const ServiceContext = createContext<ServiceContext>(serviceContextInstance);

export const ServiceContextProvider = ({ children }: PropsWithChildren) => (
  <ServiceContext.Provider value={serviceContextInstance}>
    {children}
  </ServiceContext.Provider>
);

export const useServiceContext = () => useContext(ServiceContext);
