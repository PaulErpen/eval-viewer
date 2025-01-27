import os
from typing import List
import numpy as np
from plyfile import PlyData, PlyElement


def reduce_model_size(in_path: str) -> "GaussianModel":
    gs_model = GaussianModel.load_ply(in_path)

    center = np.mean(gs_model.means, axis=0)
    dist_to_center = np.linalg.norm(gs_model.means - center[None], axis=1)

    idx_dist_exceeds = dist_to_center < 100.0

    gs_model.means = gs_model.means[idx_dist_exceeds]
    gs_model.scales = gs_model.scales[idx_dist_exceeds]
    gs_model.quats = gs_model.quats[idx_dist_exceeds]
    gs_model.opacities = gs_model.opacities[idx_dist_exceeds]
    gs_model.sh0 = gs_model.sh0[idx_dist_exceeds]
    gs_model.shN = gs_model.shN[idx_dist_exceeds]

    return gs_model


class GaussianModel:
    def __init__(
        self,
        means: np.ndarray,
        scales: np.ndarray,
        quats: np.ndarray,
        opacities: np.ndarray,
        sh0: np.ndarray,
        shN: np.ndarray,
        sh_degree=int,
    ) -> None:
        self.means = means
        self.scales = scales
        self.quats = quats
        self.opacities = opacities
        self.sh0 = sh0
        self.shN = shN
        self.sh_degree = sh_degree

    @classmethod
    def load_ply(cls, path: str) -> "GaussianModel":
        plydata = PlyData.read(path)

        xyz = np.stack(
            (
                np.asarray(plydata.elements[0]["x"]),
                np.asarray(plydata.elements[0]["y"]),
                np.asarray(plydata.elements[0]["z"]),
            ),
            axis=1,
        )
        opacities = np.asarray(plydata.elements[0]["opacity"])

        features_dc = np.zeros((xyz.shape[0], 3, 1))
        features_dc[:, 0, 0] = np.asarray(plydata.elements[0]["f_dc_0"])
        features_dc[:, 1, 0] = np.asarray(plydata.elements[0]["f_dc_1"])
        features_dc[:, 2, 0] = np.asarray(plydata.elements[0]["f_dc_2"])

        extra_f_names = [
            p.name
            for p in plydata.elements[0].properties
            if p.name.startswith("f_rest_")
        ]
        extra_f_names = sorted(extra_f_names, key=lambda x: int(x.split("_")[-1]))

        n_extra_sh = int(len(extra_f_names) / 3)
        sh_degree = int((n_extra_sh + 1) ** 0.5) - 1

        features_extra = np.zeros((xyz.shape[0], len(extra_f_names)))
        for idx, attr_name in enumerate(extra_f_names):
            features_extra[:, idx] = np.asarray(plydata.elements[0][attr_name])
        # Reshape (P,F*SH_coeffs) to (P, F, SH_coeffs except DC)
        features_extra = features_extra.reshape(
            (features_extra.shape[0], 3, n_extra_sh)
        )

        scale_names = [
            p.name
            for p in plydata.elements[0].properties
            if p.name.startswith("scale_")
        ]
        scale_names = sorted(scale_names, key=lambda x: int(x.split("_")[-1]))
        scales = np.zeros((xyz.shape[0], len(scale_names)))
        for idx, attr_name in enumerate(scale_names):
            scales[:, idx] = np.asarray(plydata.elements[0][attr_name])

        rot_names = [
            p.name for p in plydata.elements[0].properties if p.name.startswith("rot")
        ]
        rot_names = sorted(rot_names, key=lambda x: int(x.split("_")[-1]))
        rots = np.zeros((xyz.shape[0], len(rot_names)))
        for idx, attr_name in enumerate(rot_names):
            rots[:, idx] = np.asarray(plydata.elements[0][attr_name])

        return cls(
            means=xyz,
            sh0=features_dc.squeeze(-1),
            shN=features_extra.transpose(0, 2, 1),
            opacities=opacities,
            scales=scales,
            quats=rots,
            sh_degree=sh_degree,
        )

    def construct_list_of_attributes(self) -> List[str]:
        l = ["x", "y", "z", "nx", "ny", "nz"]
        # All channels except the 3 DC
        for i in range(self.sh0.shape[1]):
            l.append("f_dc_{}".format(i))
        for i in range(self.shN.shape[1] * self.shN.shape[2]):
            l.append("f_rest_{}".format(i))
        l.append("opacity")
        for i in range(self.scales.shape[1]):
            l.append("scale_{}".format(i))
        for i in range(self.quats.shape[1]):
            l.append("rot_{}".format(i))
        return l

    def save_ply(
        self,
        path: str,
    ) -> None:
        os.makedirs(os.path.dirname(path), exist_ok=True)

        xyz = self.means
        normals = np.zeros_like(xyz)
        f_dc = self.sh0
        f_rest = self.shN.reshape(
            (self.shN.shape[0], self.shN.shape[1] * self.shN.shape[2])
        )
        opacities = self.opacities.reshape((self.opacities.shape[0], 1))
        scale = self.scales
        rotation = self.quats

        dtype_full = [
            (attribute, "f4") for attribute in self.construct_list_of_attributes()
        ]

        elements = np.empty(xyz.shape[0], dtype=dtype_full)
        attributes = np.concatenate(
            (xyz, normals, f_dc, f_rest, opacities, scale, rotation), axis=1
        )
        elements[:] = list(map(tuple, attributes))
        el = PlyElement.describe(elements, "vertex")
        PlyData([el]).write(path)
