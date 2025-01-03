import { useState } from "react";
import { GSViewer } from "../gs-viewer/gs-viewer";
import { useServiceContext } from "../../context/service-context";
import { Pair } from "../../model/pair";
import { getDownloadURL, ref, getStorage } from "firebase/storage";

const storage = getStorage();

const setNextPair = async (
  previousPair: Pair | null,
  setPair: React.Dispatch<React.SetStateAction<Pair | null>>,
  getNextPair: (previousPair: Pair | null) => Promise<Pair | null>,
  setPlyUrl: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const nextPair = await getNextPair(previousPair);
  setPair(nextPair);
  if (nextPair) {
    setPlyUrl(await getDownloadURL(ref(storage, nextPair.model1)));
  }
};

export const EvalHandler = () => {
  const { evaluationService } = useServiceContext();
  const [pair, setPair] = useState<Pair | null>(null);
  const [plyUrl, setPlyUrl] = useState<string | null>(null);

  if (evaluationService.getCurrentUserId() == null) {
    evaluationService.createUserId();
  }

  if (pair == null) {
    setNextPair(pair, setPair, evaluationService.getNextPair, setPlyUrl);
  }

  return (
    <div className="eval-handler">
      {pair && plyUrl && <GSViewer plyPath={plyUrl} />}
    </div>
  );
};
