import argparse
import os
from pathlib import Path
from reduce import reduce_model_size
from google.cloud import storage

from registry import get_file_registry


def compress_model(
    dataDir,
    input_path,
    output_path,
    compression_level=0,
    alpha_removal_threshold=0.0,
    block_size: float = 5.0,
    bucket_size: int = 256,
    spherical_harmonics_level: int = 0,
):
    os.system(
        f'node {dataDir}/repos/GaussianSplats3D/util/create-ksplat.js {input_path} {output_path} {compression_level} {alpha_removal_threshold} "0,0,0" {block_size} {bucket_size} {spherical_harmonics_level}'
    )


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
        "--dataDir",
        "-d",
        type=str,
        help="The path where the data is tored",
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

    file_registry = get_file_registry(parsed_args.dataDir)

    file_path_not_exists = False

    # check that each file in the file registry exists
    for file_path, file_name in file_registry:
        if not Path(file_path).exists():
            print(f"{file_path} does not exist!")
            file_path_not_exists = True

    if file_path_not_exists:
        raise Exception("One or more file paths dont exist!")

    storage_client = storage.Client.from_service_account_json(
        parsed_args.serviceAccountKeyPath
    )
    bucket = storage_client.bucket("gs-on-a-budget.firebasestorage.app")

    file_urls = []

    for idx, file in enumerate(file_registry):
        file_path, desired_file_name = file

        if "mcmc" in file_path:
            gs_model = reduce_model_size(file_path)
            TMP_MCMC = f"{parsed_args.dataDir}/tmp_mcmc.ply"
            gs_model.save_ply(TMP_MCMC)
            file_path = TMP_MCMC

        print(f'compressing {idx+1}/{len(file_registry)} "{desired_file_name}"')
        TMP_PATH_KSPLAT = f"{parsed_args.dataDir}/{desired_file_name}.ksplat"
        compress_model(parsed_args.dataDir, file_path, TMP_PATH_KSPLAT)

        print(
            f'uploading {idx+1}/{len(file_registry)} "{TMP_PATH_KSPLAT}" to "{parsed_args.server_dir}/{desired_file_name}.ksplat"'
        )
        blob = bucket.blob(f"{parsed_args.server_dir}/{desired_file_name}.ksplat")
        blob.upload_from_filename(TMP_PATH_KSPLAT)

        print(f'upload finished {idx+1}/{len(file_registry)} to "{blob.public_url}"')
        file_urls.append(blob.public_url + "\n")

        os.unlink(TMP_PATH_KSPLAT)
        if "mcmc" in file_path:
            os.unlink(TMP_MCMC)

    with open(f"{parsed_args.dataDir}/file-urls.txt", mode="w") as file_urls_file:
        file_urls_file.writelines(file_urls)

    print("Finished")
