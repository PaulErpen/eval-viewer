from flask import Request
from typing import List, Literal, NamedTuple, Union, Dict, Tuple
from google.cloud import firestore
from google.cloud.firestore_v1 import (
    FieldFilter,
    And,
    DocumentSnapshot,
    Or,
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
    technique_1: str
    technique_2: str
    rating: Literal["first", "second", "neither"]


class Pair(NamedTuple):
    id: str
    technique_1: str
    technique_2: str

    @classmethod
    def from_document_ref(cls, document_ref: DocumentSnapshot) -> "Pair":
        data = document_ref.to_dict()
        return Pair(document_ref.id, data["technique_1"], data["technique_2"])


def get_pairs(
    db: firestore.Client,
    next_dataset: str,
    next_size: str,
) -> List[Pair]:
    pair_collection = db.collection("pair")

    results = pair_collection.where(
        filter=And(
            [
                FieldFilter(
                    field_path="dataset_name",
                    op_string="==",
                    value=next_dataset,
                ),
                FieldFilter(
                    field_path="size",
                    op_string="==",
                    value=next_size,
                ),
            ]
        )
    ).get()

    return [Pair.from_document_ref(ref) for ref in results]


def get_ratings(
    db: firestore.Client,
    next_dataset: str,
    next_size: str,
) -> List[Rating]:
    rating_ref = db.collection("rating")

    ratings_raw = rating_ref.where(
        filter=And(
            [
                FieldFilter(
                    field_path="dataset",
                    op_string="==",
                    value=next_dataset,
                ),
                FieldFilter(
                    field_path="size",
                    op_string="==",
                    value=next_size,
                ),
            ]
        )
    ).get()

    ratings: List[Rating] = []

    for rating_ref in ratings_raw:
        rating_data = rating_ref.to_dict()
        ratings.append(
            Rating(
                rating_data["pair_id"],
                rating_data["technique_1"],
                rating_data["technique_2"],
                rating=rating_data["rating"],
            )
        )

    return ratings


def create_ratings_matrix(ratings: List[Rating]) -> np.ndarray:
    ratings_matrix = np.zeros((7, 7), dtype=np.unsignedinteger)

    for rating in ratings:
        if rating.rating == "first":
            ratings_matrix[index[rating.technique_1]][index[rating.technique_2]] = (
                ratings_matrix[index[rating.technique_1]][index[rating.technique_2]] + 1
            )
        if rating.rating == "second":
            ratings_matrix[index[rating.technique_2]][index[rating.technique_1]] = (
                ratings_matrix[index[rating.technique_2]][index[rating.technique_1]] + 1
            )

    return ratings_matrix


def get_matching_database_pair_by_ids(
    pairs_to_compare: np.ndarray,
    db: firestore.Client,
    next_dataset: str,
    next_size: str,
) -> List[Dict[str, str]]:
    return_pairs: List[Dict[str, str]] = []

    for idx_1, idx_2 in pairs_to_compare:
        pair_collection = db.collection("pair")

        technique_1 = index_reversed[idx_1]
        technique_2 = index_reversed[idx_2]

        found_pairs = pair_collection.where(
            filter=And(
                [
                    FieldFilter(
                        field_path="dataset",
                        op_string="==",
                        value=next_dataset,
                    ),
                    FieldFilter(
                        field_path="size",
                        op_string="==",
                        value=next_size,
                    ),
                    Or(
                        [
                            And(
                                [
                                    FieldFilter(
                                        field_path="technique_1",
                                        op_string="==",
                                        value=technique_1,
                                    ),
                                    FieldFilter(
                                        field_path="technique_2",
                                        op_string="==",
                                        value=technique_2,
                                    ),
                                ]
                            ),
                            And(
                                [
                                    FieldFilter(
                                        field_path="technique_1",
                                        op_string="==",
                                        value=technique_2,
                                    ),
                                    FieldFilter(
                                        field_path="technique_2",
                                        op_string="==",
                                        value=technique_1,
                                    ),
                                ]
                            ),
                        ]
                    ),
                ]
            )
        ).get()

        for found_pair in found_pairs:
            data = found_pair.to_dict()
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
                    "size": data["size"],
                    "technique1": data["technique_1"],
                    "technique2": data["technique_2"],
                }
            )

    return return_pairs


# also factor in the next size and dataset!
def get_next_pair(request: RequestType) -> ResponseType:
    db = firestore.Client(project="gs-on-a-budget")

    data = request.get_json(silent=True)

    previous_dataset = data["previous_dataset"]
    previous_previous_dataset = data["previous_previous_dataset"]
    previous_model_size = data["previous_model_size"]
    previous_previous_model_size = data["previous_previous_model_size"]

    next_dataset = get_next_dataset(previous_dataset, previous_previous_dataset)
    next_size = get_next_size(previous_model_size, previous_previous_model_size)

    ratings = get_ratings(db, next_dataset, next_size)
    ratings_matrix = create_ratings_matrix(ratings)

    # Create an object of class passing the number of conditions
    asap = asap_cpu.ASAP(7)

    # Run active sampling algorithm on the matrix of comaprisons
    pairs_to_compare = asap.run_asap(ratings_matrix)

    return (
        {
            "pairs": get_matching_database_pair_by_ids(
                pairs_to_compare, db, next_dataset, next_size
            )
        },
        200,
        {"Access-Control-Allow-Origin": "*"},
    )


def get_next_dataset(previous_dataset: str, previous_previous_dataset: str) -> str:
    possible_datasets = ["room", "truck", "stump"]
    possible_datasets.remove(previous_dataset)
    possible_datasets.remove(previous_previous_dataset)

    return possible_datasets[0]


def get_next_size(previous_size: str, previous_previous_size: str) -> str:
    possible_sizes = ["low", "medium", "high"]
    possible_sizes.remove(previous_size)
    possible_sizes.remove(previous_previous_size)

    return possible_sizes[0]
