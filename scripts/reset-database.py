import argparse
from typing import Dict, List, Tuple

import firebase_admin
from firebase_admin import credentials, firestore
import firebase_admin.auth
from google.cloud.firestore_v1 import CollectionReference
import numpy as np


def rotation_to_quaternion(
    x: float, y: float, z: float, degrees=False
) -> Tuple[float, float, float, float]:
    """
    Compute a rotation quaternion from X, Y, and Z rotation angles.

    Parameters:
        x (float): Rotation angle around the X-axis (in radians by default).
        y (float): Rotation angle around the Y-axis (in radians by default).
        z (float): Rotation angle around the Z-axis (in radians by default).
        degrees (bool): If True, input angles are treated as degrees.

    Returns:
        tuple: Quaternion as (w, x, y, z).
    """
    if degrees:
        x = np.radians(x)
        y = np.radians(y)
        z = np.radians(z)

    # Compute half-angles
    cx = np.cos(x / 2)
    cy = np.cos(y / 2)
    cz = np.cos(z / 2)
    sx = np.sin(x / 2)
    sy = np.sin(y / 2)
    sz = np.sin(z / 2)

    # Quaternion multiplication (Z * Y * X order)
    w = cx * cy * cz + sx * sy * sz
    qx = sx * cy * cz - cx * sy * sz
    qy = cx * sy * cz + sx * cy * sz
    qz = cx * cy * sz - sx * sy * cz

    return (w, qx, qy, qz)


def get_rotation_from_dataset(path: str) -> Tuple[float, float, float, float]:
    if "truck" in path:
        # mapping from supersplat: x, y, z -> -z, y, -x
        return rotation_to_quaternion(x=1.0, y=0.0, z=10.0, degrees=True)
    if "room" in path:
        # mapping from supersplat: x, y, z -> -z, y, -x
        return rotation_to_quaternion(x=0.0, y=180.0, z=27.0, degrees=True)
    if "stump" in path:
        # mapping from supersplat: x, y, z -> -z, y, -x
        return rotation_to_quaternion(x=0.0, y=0.0, z=0.0, degrees=True)
    else:
        raise Exception("dataset not known for " + path)


def get_position_from_dataset(path: str) -> Tuple[float, float, float]:
    if "truck" in path:
        # mapping from supersplat: x, y, z -> -x, y, z
        return (0.58, 0.0, 0.65)
    if "room" in path:
        # mapping from supersplat: x, y, z -> -x, y, z
        return (0.0, 1.0, 0.0)
    if "stump" in path:
        # mapping from supersplat: x, y, z -> -x, y, z
        return (0.0, 0.0, 0.0)
    else:
        raise Exception("dataset not known for " + path)


def get_fov_from_dataset(path: str) -> float:
    if "truck" in path:
        return 50.5124584368011
    if "room" in path:
        return 36.20300882535897
    if "stump" in path:
        return 40.04280223394357
    else:
        raise Exception("dataset not known for " + path)


def get_aspect_from_dataset(path: str) -> float:
    if "truck" in path:
        return 1.793767186067828
    if "room" in path:
        return 1.500722891566265
    if "stump" in path:
        return 1.508484848484849
    else:
        raise Exception("dataset not known for " + path)


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
                                "rotation": get_rotation_from_dataset(dataset),
                                "position": get_position_from_dataset(dataset),
                                "fov_y": get_fov_from_dataset(dataset),
                                "aspect": get_aspect_from_dataset(dataset),
                            }
                        )
                        print(f"added pair in group {group_name}:")
                        print(f'- "{model_name_1}"')
                        print(f'- "{model_name_2}"')
                        print(f"- high_detail = {is_high_detail}\n")

            else:
                print(f"{group_name}: only has {group}")
