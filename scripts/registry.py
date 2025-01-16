import argparse
from pathlib import Path
from typing import List, NamedTuple


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
        # Mini Splatting
        ModelFile(
            f"{data_dir}/models/mini-splatting/mini_splatting-truck-low-1/point_cloud/iteration_30000/point_cloud.ply",
            "mini_splatting-truck-low-1",
        ),
        ModelFile(
            f"{data_dir}/models/mini-splatting/mini_splatting-truck-medium-1/point_cloud/iteration_30000/point_cloud.ply",
            "mini_splatting-truck-medium-1",
        ),
        ModelFile(
            f"{data_dir}/models/mini-splatting/mini_splatting-truck-high-1/point_cloud/iteration_30000/point_cloud.ply",
            "mini_splatting-truck-high-1",
        ),
        ModelFile(
            f"{data_dir}/models/mini-splatting/mini_splatting-truck-extended-1/point_cloud/iteration_30000/point_cloud.ply",
            "mini_splatting-truck-extended-1",
        ),
        # EAGLES
        ModelFile(
            f"{data_dir}/models/eagles/eagles-truck-low-1/point_cloud/iteration_30000/point_cloud.ply",
            "eagles-truck-low-1",
        ),
        ModelFile(
            f"{data_dir}/models/eagles/eagles-truck-medium-1/point_cloud/iteration_30000/point_cloud.ply",
            "eagles-truck-medium-1",
        ),
        ModelFile(
            f"{data_dir}/models/eagles/eagles-truck-high-1/point_cloud/iteration_30000/point_cloud.ply",
            "eagles-truck-high-1",
        ),
        ModelFile(
            f"{data_dir}/models/eagles/eagles-truck-extended-1/point_cloud/iteration_30000/point_cloud.ply",
            "eagles-truck-extended-1",
        ),
        # Mip Splatting
        ModelFile(
            f"{data_dir}/models/mip-splatting/mip_splatting-truck-low-1/point_cloud/iteration_30000/point_cloud.ply",
            "mip_splatting-truck-low-1",
        ),
        ModelFile(
            f"{data_dir}/models/mip-splatting/mip_splatting-truck-medium-1/point_cloud/iteration_30000/point_cloud.ply",
            "mip_splatting-truck-medium-1",
        ),
        ModelFile(
            f"{data_dir}/models/mip-splatting/mip_splatting-truck-high-1/point_cloud/iteration_30000/point_cloud.ply",
            "mip_splatting-truck-high-1",
        ),
        ModelFile(
            f"{data_dir}/models/mip-splatting/mip_splatting-truck-extended-1/point_cloud/iteration_30000/point_cloud.ply",
            "mip_splatting-truck-extended-1",
        ),
        # Gaussian Pro
        ModelFile(
            f"{data_dir}/models/gaussian-pro/gaussian_pro-truck-low-1/point_cloud/iteration_30000/point_cloud.ply",
            "gaussian_pro-truck-low-1",
        ),
        ModelFile(
            f"{data_dir}/models/gaussian-pro/gaussian_pro-truck-medium-1/point_cloud/iteration_30000/point_cloud.ply",
            "gaussian_pro-truck-medium-1",
        ),
        ModelFile(
            f"{data_dir}/models/gaussian-pro/gaussian_pro-truck-high-1/point_cloud/iteration_30000/point_cloud.ply",
            "gaussian_pro-truck-high-1",
        ),
        ModelFile(
            f"{data_dir}/models/gaussian-pro/gaussian_pro-truck-extended-1/point_cloud/iteration_30000/point_cloud.ply",
            "gaussian_pro-truck-extended-1",
        ),
        # GeoGaussian
        ModelFile(
            f"{data_dir}/models/geogaussian/geo_gaussian-truck-low-1/point_cloud/iteration_30000/point_cloud.ply",
            "geo_gaussian-truck-low-1",
        ),
        ModelFile(
            f"{data_dir}/models/geogaussian/geo_gaussian-truck-medium-1/point_cloud/iteration_30000/point_cloud.ply",
            "geo_gaussian-truck-medium-1",
        ),
        ModelFile(
            f"{data_dir}/models/geogaussian/geo_gaussian-truck-high-1/point_cloud/iteration_30000/point_cloud.ply",
            "geo_gaussian-truck-high-1",
        ),
        ModelFile(
            f"{data_dir}/models/geogaussian/geo_gaussian-truck-extended-1/point_cloud/iteration_30000/point_cloud.ply",
            "geo_gaussian-truck-extended-1",
        ),
    ]


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

    print(f"{len(not_exists)} files do not exist!")
    for msg in not_exists:
        print(msg)
