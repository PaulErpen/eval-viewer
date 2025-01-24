import argparse
import firebase_admin
from firebase_admin import credentials, firestore
import firebase_admin.auth
from google.cloud.firestore_v1 import CollectionReference
import pandas as pd

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
        "--userId",
        "-u",
        type=str,
        help="The user id that belongs to the ratings that are supposed to be deleted",
        required=True,
    )

    parsed_args = parser.parse_args()
    cred = credentials.Certificate(parsed_args.serviceAccountKeyPath)
    app = firebase_admin.initialize_app(cred, {"databaseURL": "-default"})

    database = firestore.client()

    ratingRef: CollectionReference = database.collection("rating")
    pairRef: CollectionReference = database.collection("pair")

    for ratingDoc in ratingRef.list_documents():
        doc_ref = ratingDoc.get()
        if doc_ref.get("user_id") == parsed_args.userId:
            print(f'deleted rating "{ratingDoc.id}"')
            ratingDoc.delete()
            pairDoc = pairRef.get(doc_ref.get("pair_id"))
            pairDoc.update({"n_ratings": int(pairDoc.get().get("n_ratings")) - 1})

    firebase_admin.delete_app(app)
