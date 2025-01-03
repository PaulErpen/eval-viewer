import argparse
from typing import Dict, List, Tuple

import firebase_admin
from firebase_admin import credentials, firestore
import firebase_admin.auth
from google.cloud.firestore_v1 import CollectionReference


def extract_data_from_url(url) -> Tuple[str, str, str, str]:
    model_name = url.split("/")[-1]
    model, dataset, size, index = model_name.strip(".ply").split("-")
    return model, dataset, size, index


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
        "--fileUrls",
        "-f",
        type=str,
        help="The path to the file urls where the new models are located",
        required=True,
    )

    parsed_args = parser.parse_args()

    cred = credentials.Certificate(parsed_args.serviceAccountKeyPath)
    firebase_admin.initialize_app(cred, {"databaseURL": "-default"})

    database = firestore.client()

    ratingRef: CollectionReference = database.collection("rating")
    for doc in ratingRef.list_documents():
        doc.delete()

    pairRef: CollectionReference = database.collection("pair")
    for doc in pairRef.list_documents():
        doc.delete()

    with open(parsed_args.fileUrls, mode="r") as fileUrlsFile:
        fileUrls = [url.rstrip() for url in fileUrlsFile]

        groups: Dict[str, List[str]] = dict()

        for url in fileUrls:
            model, dataset, size, index = extract_data_from_url(url)

            group_name = f"{dataset}-{size}"

            if group_name in groups:
                groups[group_name].append(url)
            else:
                groups[group_name] = [url]

        for group_name, group in groups.items():
            dataset, size = group_name.split("-")
            is_high_detail = size in ["high", "extended"]
            if len(group) > 1:
                for i in range(0, len(group) - 1):
                    for j in range(i + 1, len(group)):
                        model_name_1 = group[i].split("firebasestorage.app/")[-1]
                        model_name_2 = group[j].split("firebasestorage.app/")[-1]
                        pairRef.add(
                            {
                                "model_1": model_name_1,
                                "model_2": model_name_2,
                                "high_detail": is_high_detail,
                                "dataset": dataset,
                                "size": size,
                                "n_ratings": 0,
                            }
                        )
                        print(f"added pair in group {group_name}:")
                        print(f'- "{model_name_1}"')
                        print(f'- "{model_name_2}"')
                        print(f'- high_detail = {is_high_detail}\n')

            else:
                print(f"{group_name}: only has {group}")
