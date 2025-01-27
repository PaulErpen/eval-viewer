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

    parsed_args = parser.parse_args()
    cred = credentials.Certificate(parsed_args.serviceAccountKeyPath)
    app = firebase_admin.initialize_app(cred, {"databaseURL": "-default"})

    database = firestore.client()

    ratingRef: CollectionReference = database.collection("rating")

    for ratingDoc in ratingRef.list_documents():
        snapshot = ratingDoc.get().to_dict()
        first_rating = snapshot["rating_1"]
        second_rating = snapshot["rating_2"]
        updated_rating = "neither"
        if first_rating > second_rating:
            updated_rating = "first"
        if second_rating > first_rating:
            updated_rating = "second"
        ratingDoc.update(
            {
                "rating": updated_rating,
            }
        )

    firebase_admin.delete_app(app)
