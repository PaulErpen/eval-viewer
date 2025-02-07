from flask import Request
from typing import List, Union, Dict, Tuple
from google.cloud import firestore
import numpy as np
import asap_cpu
from repository import AbstractRepository, RepositoryImpl
from model import Rating, index

# Type aliases for request and response
RequestType = Request
ResponseType = Union[Dict, Tuple[Dict, int], Tuple[Dict, int, Dict]]


# also factor in the next size and dataset!
def get_next_pair(
    request: RequestType,
    repository: AbstractRepository | None = None,
) -> ResponseType:
    if repository is None:
        repository = RepositoryImpl(firestore.Client(project="gs-on-a-budget"))
    
    data = request.get_json(silent=True)

    if "previous_dataset" in data:
        previous_dataset = data["previous_dataset"]
        previous_previous_dataset = data["previous_previous_dataset"]
        previous_model_size = data["previous_model_size"]
        previous_previous_model_size = data["previous_previous_model_size"]

        next_datasets = get_next_possible_datasets(
            previous_dataset, previous_previous_dataset
        )
        next_sizes = get_next_possible_sizes(
            previous_model_size, previous_previous_model_size
        )
        if len(next_datasets) == 1 and len(next_sizes) == 1:
            next_dataset, next_size = next_datasets[0], next_sizes[0]
        else:
            next_dataset, next_size = determine_high_priority_dataset_and_size(
                repository, next_datasets, next_sizes
            )
    else:
        next_dataset, next_size = get_high_priority_dataset_and_size_by_previous_pairs(
            repository, data["previousPairs"]
        )

    ratings = repository.get_ratings(next_dataset, next_size)
    ratings_matrix = create_ratings_matrix(ratings)

    # Create an object of class passing the number of conditions
    asap = asap_cpu.ASAP(7)

    # Run active sampling algorithm on the matrix of comaprisons
    pairs_to_compare = asap.run_asap(ratings_matrix)

    return (
        {
            "pairs": repository.get_matching_database_pair_by_ids(
                pairs_to_compare, next_dataset, next_size
            )
        },
        200,
        {"Access-Control-Allow-Origin": "*"},
    )


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


def determine_high_priority_dataset_and_size(
    repository: AbstractRepository, next_datasets: List[str], next_sizes: List[str]
) -> Tuple[str, str]:
    priority_cache = repository.get_priority()

    for entry in priority_cache["entries"]:
        if entry["dataset"] in next_datasets and entry["size"] in next_sizes:
            return entry["dataset"], entry["size"]


def pair_not_processed_yet(
    entry: Dict[str, str], previousPairs: List[Dict[str, str]]
) -> bool:
    for pair in previousPairs:
        if entry["dataset"] == pair["dataset"] and entry["size"] == pair["size"]:
            return False
    return True


def get_high_priority_dataset_and_size_by_previous_pairs(
    repository: AbstractRepository, previousPairs: List[Dict[str, str]]
) -> Tuple[str, str]:
    priority_cache = repository.get_priority()

    for entry in priority_cache["entries"]:
        if pair_not_processed_yet(entry, previousPairs):
            return entry["dataset"], entry["size"]


def get_next_possible_datasets(
    previous_dataset: str, previous_previous_dataset: str
) -> List[str]:
    possible_datasets = ["room", "truck", "stump"]
    if previous_dataset in possible_datasets:
        possible_datasets.remove(previous_dataset)
    if previous_previous_dataset in possible_datasets:
        possible_datasets.remove(previous_previous_dataset)

    return possible_datasets


def get_next_possible_sizes(
    previous_size: str, previous_previous_size: str
) -> List[str]:
    possible_sizes = ["low", "medium", "high"]
    if previous_size in possible_sizes:
        possible_sizes.remove(previous_size)
    if previous_previous_size in possible_sizes:
        possible_sizes.remove(previous_previous_size)

    return possible_sizes
