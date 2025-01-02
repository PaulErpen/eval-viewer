import admin from "firebase-admin";
import * as fs from "fs";

// Parse command-line arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error(
    "Usage: node setCustomClaims.js <serviceAccountKeyPath> <userId> <role>"
  );
  process.exit(1);
}

const [serviceAccountKeyPath, userId, role] = args;

// Validate service account key file
if (!fs.existsSync(serviceAccountKeyPath)) {
  console.error(
    `Error: Service account key file not found at path: ${serviceAccountKeyPath}`
  );
  process.exit(1);
}

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountKeyPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setCustomClaim(uid, role) {
  try {
    // Set custom claim
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(
      `Custom claim { role: '${role}' } set for user with UID: ${uid}`
    );
  } catch (error) {
    console.error("Error setting custom claims:", error);
    process.exit(1);
  }
}

// Call the function with provided arguments
setCustomClaim(userId, role);
