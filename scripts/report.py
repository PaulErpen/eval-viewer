import argparse
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

    parsed_args = parser.parse_args()

    cred = credentials.Certificate(parsed_args.serviceAccountKeyPath)
    firebase_admin.initialize_app(cred, {"databaseURL": "-default"})

    database = firestore.client()

    ratingRef: CollectionReference = database.collection("rating")
    for doc in ratingRef.list_documents():
        pass

    pairRef: CollectionReference = database.collection("pair")
    for doc in pairRef.list_documents():
        pass
    