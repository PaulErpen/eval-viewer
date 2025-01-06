import argparse
import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials
import firebase_admin.auth
from google.cloud import storage


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
        "--file_dir",
        "-f",
        type=str,
        help="The path to the directory of files to upload",
        required=True,
    )

    parser.add_argument(
        "--server_dir",
        "-s",
        type=str,
        help="The directory path on the server/firebase storage",
        required=True,
    )

    parsed_args = parser.parse_args()

    storage_client = storage.Client.from_service_account_json(
        parsed_args.serviceAccountKeyPath
    )
    bucket = storage_client.bucket("gs-on-a-budget.firebasestorage.app")

    file_urls = []

    files = os.listdir(parsed_args.file_dir)
    for idx, file in enumerate(files):
        if Path(f"{parsed_args.file_dir}/{file}").is_file():
            print(
                f'uploading {idx+1}/{len(files)} "{parsed_args.file_dir}/{file}" to "{parsed_args.server_dir}/{file}"'
            )
            blob = bucket.blob(f"{parsed_args.server_dir}/{file}")
            blob.upload_from_filename(f"{parsed_args.file_dir}/{file}")
            file_urls.append(blob.public_url + "\n")

    with open("scripts/file-urls.txt", mode="w") as file_urls_file:
        file_urls_file.writelines(file_urls)

    print("Finished")
