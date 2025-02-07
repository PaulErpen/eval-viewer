from abc import ABC
from typing import Dict, List
from google.cloud import firestore
from google.cloud.firestore_v1 import (
    FieldFilter,
    And,
    Or,
)
from model import Pair, Rating, index_reversed
import numpy as np


class AbstractRepository(ABC):
    def get_pairs(
        self,
        next_dataset: str,
        next_size: str,
    ) -> List[Pair]:
        raise NotImplementedError("Not implemented yet!")

    def get_ratings(
        self,
        next_dataset: str,
        next_size: str,
    ) -> List[Rating]:
        raise NotImplementedError("Not implemented yet!")

    def get_matching_database_pair_by_ids(
        self,
        pairs_to_compare: np.ndarray,
        next_dataset: str,
        next_size: str,
    ) -> List[Dict[str, str]]:
        raise NotImplementedError("Not implemented yet!")

    def get_priority(self) -> Dict[str, str]:
        raise NotImplementedError("Not implemented yet!")


class RepositoryImpl(AbstractRepository):
    def __init__(
        self,
        db: firestore.Client,
    ):
        super().__init__()
        self.db = db

    def get_pairs(
        self,
        next_dataset: str,
        next_size: str,
    ) -> List[Pair]:
        pair_collection = self.db.collection("pair")

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
        self,
        next_dataset: str,
        next_size: str,
    ) -> List[Rating]:
        rating_ref = self.db.collection("rating")

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

    def get_matching_database_pair_by_ids(
        self,
        pairs_to_compare: np.ndarray,
        next_dataset: str,
        next_size: str,
    ) -> List[Dict[str, str]]:
        return_pairs: List[Dict[str, str]] = []

        for idx_1, idx_2 in pairs_to_compare:
            pair_collection = self.db.collection("pair")

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

    def get_priority(self) -> Dict[str, str]:
        priority_cache_ref = self.db.collection("priority")

        for doc in priority_cache_ref.list_documents():
            return doc.get().to_dict()

        raise Exception("No priority cache in database found!")
