import os
from unittest import mock
import unittest
from main import RequestType, ResponseType, get_next_pair


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

        response: ResponseType = get_next_pair(request)

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

        response: ResponseType = get_next_pair(request)

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

        response: ResponseType = get_next_pair(request)

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

        response: ResponseType = get_next_pair(request)

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

        response: ResponseType = get_next_pair(request)

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

        response: ResponseType = get_next_pair(request)

        self.assertEquals(len(response[0]["pairs"]), 6)

    def test_given_an_empty_list_of_previous_pairs__when_executing_asap__then_return_valid_pairs(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(return_value={"previousPairs": []})

        response: ResponseType = get_next_pair(request)

        self.assertEquals(len(response[0]["pairs"]), 6)

    def test_given_an_single_item_list_of_previous_pairs__when_executing_asap__then_return_pairs_not_of_that_facet(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={"previousPairs": [{"dataset": "stump", "size": "low"}]}
        )

        response: ResponseType = get_next_pair(request)

        for pair in response[0]["pairs"]:
            self.assertNotEquals(pair["datasetName"], "stump")
            self.assertNotEquals(pair["size"], "low")

    def test_given_an_list_of_previous_pairs_with_all_but_one_facet__when_executing_asap__then_return_pairs_of_that_facet(
        self,
    ) -> None:
        request: RequestType = mock.MagicMock()
        request.get_json = mock.Mock(
            return_value={
                "previousPairs": [
                    {"dataset": "stump", "size": "low"},
                    {"dataset": "stump", "size": "medium"},
                    {"dataset": "stump", "size": "high"},
                    {"dataset": "room", "size": "low"},
                    {"dataset": "room", "size": "medium"},
                    {"dataset": "room", "size": "high"},
                    {"dataset": "truck", "size": "low"},
                    {"dataset": "truck", "size": "medium"},
                ]
            }
        )

        response: ResponseType = get_next_pair(request)

        for pair in response[0]["pairs"]:
            self.assertEqual(pair["datasetName"], "truck")
            self.assertEqual(pair["size"], "high")


if __name__ == "__main__":
    unittest.main()
