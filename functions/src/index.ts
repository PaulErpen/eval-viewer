/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { HttpsError, onCall } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onCall({ cors: true }, async () => {
  try {
    logger.info("called hello world updated!");

    return "Hello World!";
  } catch (err) {
    logger.error("Error:", err);
    throw new HttpsError("internal", "An error occurred");
  }
});
