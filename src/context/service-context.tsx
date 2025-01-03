import { createContext, PropsWithChildren, useContext } from "react";
import { initializeFirebase } from "./initialize-firebase";
import {
  EvaluationService,
  EvaluationServiceImpl,
} from "../service/evaluation-service";
import { RepositoryImpl } from "../repository/repository";

export interface ServiceContext {
  evaluationService: EvaluationService;
}

const firebaseApp = initializeFirebase();
const serviceContextInstance = {
  evaluationService: new EvaluationServiceImpl(new RepositoryImpl(firebaseApp)),
};
const ServiceContext = createContext<ServiceContext>(serviceContextInstance);

export const ServiceContextProvider = ({ children }: PropsWithChildren) => (
  <ServiceContext.Provider value={serviceContextInstance}>
    {children}
  </ServiceContext.Provider>
);

export const useServiceContext = () => useContext(ServiceContext);
