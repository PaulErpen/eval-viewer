import os
from unittest import mock
from main import RequestType, ResponseType, get_next_pair

if __name__ == "__main__":
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = (
        "../../keys/gs-on-a-budget-firebase-adminsdk-63ws0-509fffaf5f.json"
    )
    request: RequestType = mock.MagicMock()
    request.get_json = mock.Mock(
        return_value={
            "previous_dataset": "truck",
            "previous_previous_dataset": "room",
            "previous_model_size": "small",
            "previous_previous_model_size": "medium",
        }
    )

    response: ResponseType = get_next_pair(request)
