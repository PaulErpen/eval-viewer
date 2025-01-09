// @ts-ignore
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useState } from "react";
import * as THREE from "three";
import "./gs-viewer.scss";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export interface GSViewerProps {
  plyPath1: String;
  plyPath2: String;
  showFirst: boolean;
  rotation_w: number;
  rotation_qx: number;
  rotation_qy: number;
  rotation_qz: number;
  position_x: number;
  position_y: number;
  position_z: number;
}

const resizeRendererToDisplaySize = (renderer: THREE.Renderer) => {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
};

export const GSViewer = ({
  plyPath1,
  plyPath2,
  showFirst,
  rotation_w,
  rotation_qx,
  rotation_qy,
  rotation_qz,
  position_x,
  position_y,
  position_z,
}: GSViewerProps) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvas && plyPath1 && plyPath1.length > 0) {
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        canvas,
        alpha: true,
      });
      const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 500);

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      camera.position.z = 2;

      const gsViewer1 = createViewer(
        plyPath1,
        rotation_w,
        rotation_qx,
        rotation_qy,
        rotation_qz,
        position_x,
        position_y,
        position_z
      );
      scene.add(gsViewer1);

      const gsViewer2 = createViewer(
        plyPath2,
        rotation_w,
        rotation_qx,
        rotation_qy,
        rotation_qz,
        position_x,
        position_y,
        position_z
      );
      scene.add(gsViewer2);

      const render = () => {
        requestAnimationFrame(render);

        if (renderer.domElement.dataset.showFirst === "true") {
          gsViewer1.visible = true;
          gsViewer2.visible = false;
        } else {
          gsViewer1.visible = false;
          gsViewer2.visible = true;
        }

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        controls.update();

        renderer.render(scene, camera);
      };
      requestAnimationFrame(render);
    }
  }, [plyPath1, plyPath2, canvas]);

  return (
    <div className="viewer" data-model-path={plyPath1}>
      <canvas ref={setCanvas} data-show-first={showFirst} />
    </div>
  );
};
function createViewer(
  plyPath1: String,
  rotation_w: number,
  rotation_qx: number,
  rotation_qy: number,
  rotation_qz: number,
  position_x: number,
  position_y: number,
  position_z: number
) {
  const gsViewer1 = new GaussianSplats3D.DropInViewer({
    integerBasedSort: false,
    sphericalHarmonicsDegree: 0,
  });
  gsViewer1.addSplatScene(plyPath1, {
    progressiveLoad: true,
    format: 1,
    rotation: [rotation_w, rotation_qx, rotation_qy, rotation_qz],
    position: [position_x, position_y, position_z],
  });
  return gsViewer1;
}
