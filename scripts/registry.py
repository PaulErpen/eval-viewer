import argparse
import os
from pathlib import Path
from typing import List, NamedTuple


class ModelFile(NamedTuple):
    file_location: str
    desired_name: str


def get_file_registry(data_dir: str) -> List[ModelFile]:
    model_files = []
    for size in ["low", "medium", "high", "extended"]:
        for dataset in ["room", "stump", "truck"]:
            for technique in [
                "default",
                "mcmc",
                "mini_splatting",
                "eagles",
                "mip_splatting",
                "gaussian_pro",
                "geo_gaussian",
            ]:
                if technique in ["default", "mcmc"]:
                    model_files.append(
                        ModelFile(
                            f"{data_dir}/models/{technique}/{technique}-{dataset}-{size}-1/{technique}-{dataset}-{size}-1_model.ply",
                            f"{technique}-{dataset}-{size}-1",
                        )
                    )
                elif technique == "mini_splatting":
                    model_files.append(
                        ModelFile(
                            f"{data_dir}/models/mini-splatting/mini_splatting-{dataset}-{size}-1/point_cloud/iteration_30000/point_cloud.ply",
                            f"mini_splatting-{dataset}-{size}-1",
                        ),
                    )
                elif technique == "eagles":
                    model_files.append(
                        ModelFile(
                            f"{data_dir}/models/eagles/eagles-{dataset}-{size}-1/point_cloud/iteration_30000/point_cloud.ply",
                            f"eagles-{dataset}-{size}-1",
                        ),
                    )
                elif technique == "mip_splatting":
                    model_files.append(
                        ModelFile(
                            f"{data_dir}/models/mip-splatting/mip_splatting-{dataset}-{size}-1/point_cloud/iteration_30000/point_cloud.ply",
                            f"mip_splatting-{dataset}-{size}-1",
                        ),
                    )
                elif technique == "gaussian_pro":
                    model_files.append(
                        ModelFile(
                            f"{data_dir}/models/gaussian-pro/gaussian_pro-{dataset}-{size}-1/point_cloud/iteration_30000/point_cloud.ply",
                            f"gaussian_pro-{dataset}-{size}-1",
                        ),
                    )
                elif technique == "geo_gaussian":
                    model_files.append(
                        ModelFile(
                            f"{data_dir}/models/geogaussian/geo_gaussian-{dataset}-{size}-1/point_cloud/iteration_30000/point_cloud.ply",
                            f"geo_gaussian-{dataset}-{size}-1",
                        ),
                    )
                else:
                    raise Exception(f"technique {technique} unknown!")
    return model_files


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--clean",
        "-c",
        action="store_true",
        help="If flag is set then the model registry is cleaned, i.e. all model files are deleted",
    )

    parser.add_argument(
        "--dataDir",
        "-d",
        type=str,
        help="The path where the data is tored",
        required=True,
    )

    parsed_args = parser.parse_args()

    registry = get_file_registry(parsed_args.dataDir)

    not_exists = []

    for file_path, required_name in registry:
        if not Path(file_path).exists():
            not_exists.append(f'{required_name} @ "{file_path}"')
        elif parsed_args.clean:
            os.unlink(file_path)

    print(f"{len(not_exists)} files do not exist!")
    for msg in not_exists:
        print(msg)
