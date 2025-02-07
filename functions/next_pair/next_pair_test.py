import os
from typing import Any, Dict, List
from unittest import mock
import unittest
from model import Pair, Rating, index, index_reversed
from repository import AbstractRepository
from main import RequestType, ResponseType, get_next_pair
import numpy as np


class MockedRepository(AbstractRepository):
    def __init__(
        self,
        priority: Dict[str, Any] = {
            "entries": [
                {
                    "count": 1,
                    "dataset": "truck",
                    "size": "high",
                },
                {
                    "count": 2,
                    "dataset": "room",
                    "size": "low",
                },
                {
                    "count": 3,
                    "dataset": "room",
                    "size": "medium",
                },
                {
                    "count": 4,
                    "dataset": "stump",
                    "size": "low",
                },
                {
                    "count": 5,
                    "dataset": "stump",
                    "size": "high",
                },
                {
                    "count": 6,
                    "dataset": "truck",
                    "size": "medium",
                },
                {
                    "count": 7,
                    "dataset": "truck",
                    "size": "low",
                },
                {
                    "count": 8,
                    "dataset": "stump",
                    "size": "medium",
                },
                {
                    "count": 9,
                    "dataset": "room",
                    "size": "high",
                },
            ],
            "timestamp": "2025-02-07T05:00:27.899046",
        },
    ):
        self.default_priority = priority

    def get_pairs(
        self,
        next_dataset: str,
        next_size: str,
    ) -> List[Pair]:
        ret = []
        for model_name_1, idx1 in index.items():
            for model_name_2, idx2 in index.items():
                if model_name_1 == model_name_2 and idx1 > idx2:
                    ret.append(Pair("", model_name_1, model_name_2))

        return ret

    def get_ratings(
        self,
        next_dataset: str,
        next_size: str,
    ) -> List[Rating]:
        ratings: List[Rating] = []

        for model_name_1, idx1 in index.items():
            for model_name_2, idx2 in index.items():
                if model_name_1 == model_name_2 and idx1 > idx2:
                    ratings.append(
                        Rating(
                            "",
                            model_name_1,
                            model_name_2,
                            rating="first",
                        )
                    )

        return ratings

    def get_matching_database_pair_by_ids(
        self,
        pairs_to_compare: np.ndarray,
        next_dataset: str,
        next_size: str,
    ) -> List[Dict[str, str]]:
        pairs: List[Dict[str, Any]] = []

        for id, idxs in enumerate(pairs_to_compare):
            idx_1, idx_2 = idxs
            pairs.append(
                {
                    "id": id,
                    "model1": index_reversed[idx_1],
                    "model2": index_reversed[idx_2],
                    "highDetail": None,
                    "nRatings": 0,
                    "rotation": None,
                    "position": None,
                    "fovY": None,
                    "aspect": None,
                    "initialDistance": None,
                    "datasetName": next_dataset,
                    "size": next_size,
                    "technique1": index_reversed[idx_1],
                    "technique2": index_reversed[idx_2],
                }
            )

        return pairs

    def get_priority(self) -> Dict[str, str]:
        return self.default_priority


class TestNextPairCloudFunction(unittest.TestCase):
    def setUp(self) -> None:
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = (
            "./keys/gs-on-a-budget-firebase-adminsdk-63ws0-509fffaf5f.json"
        )

    def test_given_a_current_dataset_of_stump_and_size_of_high__when_executing_asap__then_return_6_pairs(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={
                "previous_dataset": "truck",
                "previous_previous_dataset": "room",
                "previous_model_size": "low",
                "previous_previous_model_size": "medium",
            }
        )

        response: ResponseType = get_next_pair(request, MockedRepository())

        self.assertEquals(len(response[0]["pairs"]), 6)

    def test_given_a_current_dataset_of_stump_and_size_of_high__when_executing_asap__then_all_pairs_must_be_stump_pairs(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={
                "previous_dataset": "truck",
                "previous_previous_dataset": "room",
                "previous_model_size": "low",
                "previous_previous_model_size": "medium",
            }
        )

        response: ResponseType = get_next_pair(request, MockedRepository())

        for pair in response[0]["pairs"]:
            self.assertEqual(pair["datasetName"], "stump")

    def test_given_a_current_dataset_of_stump_and_size_of_high__when_executing_asap__then_all_pairs_must_be_high_pairs(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={
                "previous_dataset": "truck",
                "previous_previous_dataset": "room",
                "previous_model_size": "low",
                "previous_previous_model_size": "medium",
            }
        )

        response: ResponseType = get_next_pair(request, MockedRepository())

        for pair in response[0]["pairs"]:
            self.assertEqual(pair["size"], "high")

    def test_given_a_current_dataset_of_truck_and_size_of_low__when_executing_asap__then_all_pairs_must_be_truck_pairs(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={
                "previous_dataset": "stump",
                "previous_previous_dataset": "room",
                "previous_model_size": "high",
                "previous_previous_model_size": "medium",
            }
        )

        response: ResponseType = get_next_pair(request, MockedRepository())

        for pair in response[0]["pairs"]:
            self.assertEqual(pair["datasetName"], "truck")

    def test_given_a_current_dataset_of_truck_and_size_of_low__when_executing_asap__then_all_pairs_must_be_low_pairs(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={
                "previous_dataset": "stump",
                "previous_previous_dataset": "room",
                "previous_model_size": "high",
                "previous_previous_model_size": "medium",
            }
        )

        response: ResponseType = get_next_pair(request, MockedRepository())

        for pair in response[0]["pairs"]:
            self.assertEqual(pair["size"], "low")

    def test_given_empty_previous_dataset__when_executing_asap__then_return_valid_pairs(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={
                "previous_dataset": "",
                "previous_previous_dataset": "",
                "previous_model_size": "",
                "previous_previous_model_size": "",
            }
        )

        response: ResponseType = get_next_pair(request, MockedRepository())

        self.assertEquals(len(response[0]["pairs"]), 6)

    def test_given_empty_previous_dataset__when_executing_asap__then_return_pairs_that_conform_to_the_default_priority(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={
                "previous_dataset": "",
                "previous_previous_dataset": "",
                "previous_model_size": "",
                "previous_previous_model_size": "",
            }
        )

        response: ResponseType = get_next_pair(request, MockedRepository())

        for pair in response[0]["pairs"]:
            self.assertEquals(pair["datasetName"], "truck")
            self.assertEquals(pair["size"], "high")

    def test_given_an_empty_list_of_previous_pairs__when_executing_asap__then_return_valid_pairs(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(return_value={"previousPairs": []})

        response: ResponseType = get_next_pair(request, MockedRepository())

        self.assertEquals(len(response[0]["pairs"]), 6)

    def test_given_an_single_item_list_of_previous_pairs__when_executing_asap__then_return_pairs_not_of_that_facet(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={"previousPairs": [{"dataset": "stump", "size": "low"}]}
        )

        response: ResponseType = get_next_pair(request, MockedRepository())

        for pair in response[0]["pairs"]:
            self.assertNotEquals(pair["datasetName"], "stump")
            self.assertNotEquals(pair["size"], "low")

    def test_given_an_empty_list_of_previous_pairs__when_executing_asap__then_return_pairs_of_the_default_priority_facet(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(return_value={"previousPairs": []})

        response: ResponseType = get_next_pair(request, MockedRepository())

        for pair in response[0]["pairs"]:
            self.assertEqual(pair["datasetName"], "truck")
            self.assertEqual(pair["size"], "high")

    def test_given_an_list_of_previous_pairs_with_all_but_one_facet__when_executing_asap__then_return_pairs_of_that_facet(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={
                "previousPairs": [
                    {"dataset": "stump", "size": "low"},
                    {"dataset": "stump", "size": "high"},
                    {"dataset": "room", "size": "low"},
                    {"dataset": "room", "size": "medium"},
                    {"dataset": "room", "size": "high"},
                    {"dataset": "truck", "size": "low"},
                    {"dataset": "truck", "size": "medium"},
                    {"dataset": "truck", "size": "high"},
                ]
            }
        )

        response: ResponseType = get_next_pair(request, MockedRepository())

        for pair in response[0]["pairs"]:
            self.assertEqual(pair["datasetName"], "stump")
            self.assertEqual(pair["size"], "medium")


if __name__ == "__main__":
    unittest.main()
