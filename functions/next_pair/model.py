from typing import Literal, NamedTuple
from google.cloud.firestore_v1 import (
    DocumentSnapshot,
)

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
