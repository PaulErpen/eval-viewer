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
    app = firebase_admin.initialize_app(cred, {"databaseURL": "-default"})

    database = firestore.client()

    pairsById = {}

    for pairRef in database.collection("pair").list_documents():
        doc = pairRef.get()
        data = doc.to_dict()
        model = data["model_1"].replace("splats/", "").split("-")[0]
        dataset = data["model_1"].replace("splats/", "").split("-")[1]
        size = data["model_1"].replace("splats/", "").split("-")[2]

        data["model"] = model
        data["dataset"] = dataset
        data["size"] = size

        pairsById[doc.id] = data

        if size == "extended":
            pairRef.delete()
        else:
            pairRef.update({"dataset": dataset, "size": size, "model": model})

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

        pair = pairsById[snapshot["pair_id"]]

        if pair["size"] == "extended":
            ratingDoc.delete()
        else:
            ratingDoc.update(
                {
                    "rating": updated_rating,
                    "model": pair["model"],
                    "dataset": pair["dataset"],
                    "size": pair["size"],
                }
            )

    firebase_admin.delete_app(app)
