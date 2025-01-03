import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { DownloadUrlProvider } from "../../service/helpers/download-url-provider";

export const provideDownloadUrl: DownloadUrlProvider = async (
  storageFileName: string
) => {
  const storage = getStorage();

  return getDownloadURL(ref(storage, storageFileName));
};
