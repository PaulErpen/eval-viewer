import argparse
import os
from pathlib import Path
from typing import List, NamedTuple

from google.cloud import storage


class ModelFile(NamedTuple):
    file_location: str
    desired_name: str


def get_file_registry(data_dir: str) -> List[ModelFile]:
    return [
        # Default
        ModelFile(
            f"{data_dir}/models/default/default-truck-low-1/default-truck-low-1_model.ply",
            "default-truck-low-1",
        ),
        ModelFile(
            f"{data_dir}/models/default/default-truck-medium-1/default-truck-medium-1_model.ply",
            "default-truck-medium-1",
        ),
        ModelFile(
            f"{data_dir}/models/default/default-truck-high-1/default-truck-high-1_model.ply",
            "default-truck-high-1",
        ),
        ModelFile(
            f"{data_dir}/models/default/default-truck-extended-1/default-truck-extended-1_model.ply",
            "default-truck-extended-1",
        ),
        # MCMC
        ModelFile(
            f"{data_dir}/models/mcmc/mcmc-truck-low-1/mcmc-truck-low-1_model.ply",
            "mcmc-truck-low-1",
        ),
        ModelFile(
            f"{data_dir}/models/mcmc/mcmc-truck-medium-1/mcmc-truck-medium-1_model.ply",
            "mcmc-truck-medium-1",
        ),
        ModelFile(
            f"{data_dir}/models/mcmc/mcmc-truck-high-1/mcmc-truck-high-1_model.ply",
            "mcmc-truck-high-1",
        ),
        ModelFile(
            f"{data_dir}/models/mcmc/mcmc-truck-extended-1/mcmc-truck-extended-1_model.ply",
            "mcmc-truck-extended-1",
        ),
    ]


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
        print(f'compressing {idx+1}/{len(len(file_registry))} "{desired_file_name}"')
        TMP_PATH = f"{parsed_args.dataDir}/{desired_file_name}.ksplat"
        compress_model(parsed_args.dataDir, file_path, TMP_PATH)

        blob = bucket.blob(f"{parsed_args.server_dir}/{desired_file_name}.ksplat")
        blob.upload_from_filename(f"{parsed_args.file_dir}/{file}")
        file_urls.append(blob.public_url + "\n")
        os.unlink(TMP_PATH)

    with open(f"{parsed_args.dataDir}/file-urls.txt", mode="w") as file_urls_file:
        file_urls_file.writelines(file_urls)

    print("Finished")
