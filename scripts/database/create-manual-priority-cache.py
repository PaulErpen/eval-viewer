import argparse
import firebase_admin
from firebase_admin import credentials, firestore
import firebase_admin.auth
import pandas as pd
import datetime as dt 

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

    db = firestore.client()

    priority_cache_ref = db.collection("priority")
    rating_ref = db.collection("rating")

    records = []

    for rating_ref in rating_ref.list_documents():
        rating = rating_ref.get()
        rating_data = rating.to_dict()
        records.append(
            {
                "id": rating.id,
                "size": rating_data["size"],
                "dataset": rating_data["dataset"],
            }
        )

    df_rating_counts = (
        pd.DataFrame.from_records(records)
        .groupby(["dataset", "size"])["id"]
        .count()
        .reset_index()
        .sort_values("id")
    )

    priority_cache = {
        "entries": [
            {
                "dataset": row["dataset"],
                "size": row["size"],
                "count": row["id"],
            }
            for idx, row in df_rating_counts.iterrows()
        ],
        "timestamp": dt.datetime.now().isoformat(),
    }

    for doc in priority_cache_ref.list_documents():
        doc.delete()

    priority_cache_ref.add(priority_cache)