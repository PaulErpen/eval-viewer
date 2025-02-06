from google.cloud import firestore
import functions_framework
import datetime as dt
import pandas as pd

@functions_framework.http
def update_priority(request):
    db = firestore.Client(project="gs-on-a-budget")
    rating_ref = db.collection("rating")
    priority_cache_ref = db.collection("priority")
    records = []

    for rating_doc in rating_ref.list_documents():
        rating = rating_doc.get()
        rating_data = rating.to_dict()
        records.append({
            "id": rating.id,
            "size": rating_data["size"],
            "dataset": rating_data["dataset"],
        })

    df_rating_counts = (
        pd.DataFrame.from_records(records)
        .groupby(["dataset", "size"])["id"]
        .count()
        .reset_index()
        .sort_values("id")
    )

    priority_cache = {
        "entries": [
            {"dataset": row["dataset"], "size": row["size"], "count": row["id"]}
            for _, row in df_rating_counts.iterrows()
        ],
        "timestamp": dt.datetime.now().isoformat(),
    }

    for doc in priority_cache_ref.list_documents():
        doc.delete()

    priority_cache_ref.add(priority_cache)
    return "Priority cache updated", 200