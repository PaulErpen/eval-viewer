from flask import Request
from typing import List, Literal, NamedTuple, Union, Dict, Tuple
from google.cloud import firestore
from google.cloud.firestore_v1 import (
    DocumentReference,
    FieldFilter,
    And,
    DocumentSnapshot,
)
import numpy as np
import asap_cpu

# Type aliases for request and response
RequestType = Request
ResponseType = Union[Dict, Tuple[Dict, int], Tuple[Dict, int, Dict]]

index = {
    "default": 0,
    "mcmc": 1,
    "mini_splatting": 2,
    "eagles": 3,
    "mip_splatting": 4,
    "gaussian_pro": 5,
    "geo_gaussian": 6,
}
index_reversed = {idx: name for name, idx in index.items()}


class Rating(NamedTuple):
    pair_id: str
    model_1: str
    model_2: str
    rating: Literal["first", "second", "neither"]


class Pair(NamedTuple):
    id: str
    model_1: str
    model_2: str

    @classmethod
    def from_document_ref(cls, document_ref: DocumentSnapshot) -> "Pair":
        data = document_ref.to_dict()
        return Pair(
            document_ref.id,
            data["model_1"].replace("splats/", "").split("-")[0],
            data["model_2"].replace("splats/", "").split("-")[0],
        )


def get_pairs(
    db: firestore.Client,
    previous_dataset: str,
    previous_previous_dataset: str,
    previous_model_size: str,
    previous_previous_model_size: str,
) -> List[Pair]:
    pair_collection = db.collection("pair")

    results = pair_collection.where(
        filter=And(
            [
                FieldFilter(
                    field_path="dataset_name",
                    op_string="not-in",
                    value=[previous_dataset, previous_previous_dataset],
                ),
            ]
        )
    ).get()

    returned_pairs: List[Pair] = []

    for ref in results:
        pair = Pair.from_document_ref(ref)
        if (
            previous_model_size not in pair.model_1
            and previous_previous_model_size not in pair.model_1
        ):
            returned_pairs.append(pair)

    return returned_pairs


def get_ratings(db: firestore.Client, pairs: List[Pair]) -> List[Rating]:
    rating_ref = db.collection("rating")

    pair_idx = {pair.id: pair for pair in pairs}

    ratings_raw = rating_ref.where(
        field_path="pair_id", op_string="in", value=[pair.id for pair in pairs]
    ).get()

    ratings: List[Rating] = []
    for rating_ref in ratings_raw:
        rating_data = rating_ref.get().to_dict()
        pair = pair_idx[rating_data["pair_id"]]
        ratings.append(
            Rating(
                rating_data["pair_id"],
                pair.model_1,
                pair.model_2,
                rating=rating_data["rating"],
            )
        )

    return ratings


def create_ratings_matrix(ratings: List[Rating]) -> np.ndarray:
    ratings_matrix = np.zeros((7, 7), dtype=np.unsignedinteger)

    for rating in ratings:
        if rating["rating"] == "first":
            ratings_matrix[index[rating.model_1]][index[rating.model_2]] = (
                ratings_matrix[index[rating.model_1]][index[rating.model_2]] + 1
            )
        if rating["rating"] == "second":
            ratings_matrix[index[rating.model_2]][index[rating.model_1]] = (
                ratings_matrix[index[rating.model_2]][index[rating.model_1]] + 1
            )

    return ratings_matrix


def get_matching_database_pair_by_ids(
    pairs_to_compare: np.ndarray,
    db: firestore.Client,
    previous_dataset: str,
    previous_previous_dataset: str,
    previous_high_detail: bool,
) -> List[Dict[str, str]]:
    return_pairs: List[Dict[str, str]] = []

    possible_datasets = ["room", "truck", "stump"]
    possible_datasets.remove(previous_dataset)
    possible_datasets.remove(previous_previous_dataset)

    if previous_high_detail:
        possible_sizes = ["small", "medium"]
    else:
        possible_sizes = ["high", "extended"]

    for idx_1, idx_2 in pairs_to_compare:
        pair_collection = db.collection("pair")

        name_options = [
            f"splats/{index_reversed[idx_1]}-{possible_datasets[0]}-{possible_sizes[0]}-1.ksplat",
            f"splats/{index_reversed[idx_1]}-{possible_datasets[0]}-{possible_sizes[1]}-1.ksplat",
            f"splats/{index_reversed[idx_2]}-{possible_datasets[0]}-{possible_sizes[0]}-1.ksplat",
            f"splats/{index_reversed[idx_2]}-{possible_datasets[0]}-{possible_sizes[1]}-1.ksplat",
        ]

        found_pairs = pair_collection.where(
            field_path="model_1",
            op_string="in",
            value=name_options,
        ).get()

        for found_pair in found_pairs:
            data = found_pair.get().to_dict()
            return_pairs.append(
                {
                    "id": found_pair.id,
                    "model1": data["model_1"],
                    "model2": data["model_2"],
                    "highDetail": data["high_detail"],
                    "nRatings": data["n_ratings"],
                    "rotation": data["rotation"],
                    "position": data["position"],
                    "fovY": data["fov_y"],
                    "aspect": data["aspect"],
                    "initialDistance": data["initial_distance"],
                    "datasetName": data["dataset_name"],
                }
            )
    return found_pairs


# also factor in the next size and dataset!
def get_next_pair(request: RequestType) -> ResponseType:
    db = firestore.Client(project="gs-on-a-budget")

    data = request.get_json(silent=True)

    previous_dataset = data["previous_dataset"]
    previous_previous_dataset = data["previous_previous_dataset"]
    previous_model_size = data["previous_model_size"]
    previous_previous_model_size = data["previous_model_size"]

    pairs = get_pairs(
        db,
        previous_dataset,
        previous_previous_dataset,
        previous_model_size,
        previous_previous_model_size,
    )
    ratings = get_ratings(db, pairs)
    ratings_matrix = create_ratings_matrix(ratings)

    # Create an object of class passing the number of conditions
    asap = asap_cpu.ASAP(7)

    # Run active sampling algorithm on the matrix of comaprisons
    pairs_to_compare = asap.run_asap(ratings_matrix)

    # Calling print
    print(pairs_to_compare)

    return (
        {"pairs": get_matching_database_pair_by_ids(pairs_to_compare)},
        200,
        {"Access-Control-Allow-Origin": "*"},
    )
