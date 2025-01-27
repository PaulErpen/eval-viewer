import argparse
import json
import firebase_admin
from firebase_admin import credentials, firestore
import firebase_admin.auth
from google.cloud.firestore_v1 import CollectionReference

if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--serviceAccountKeyPath",
        "-p",
        type=str,
        help="The path to the service account key",
        required=True,
    )

    parser.add_argument(
        "--filePath",
        "-f",
        type=str,
        help="The file the ratings are stored in",
        required=True,
    )

    parsed_args = parser.parse_args()
    cred = credentials.Certificate(parsed_args.serviceAccountKeyPath)
    app = firebase_admin.initialize_app(cred, {"databaseURL": "-default"})

    database = firestore.client()

    ratingRef: CollectionReference = database.collection("rating")

    for ratingDoc in ratingRef.list_documents():
        ratingDoc.delete()

    with open(parsed_args.filePath, "r") as f:
        ratingsDict = json.load(f)

    for id, ratingDoc in ratingsDict.items():
        ratingRef.document(id).set(ratingDoc)

    firebase_admin.delete_app(app)
