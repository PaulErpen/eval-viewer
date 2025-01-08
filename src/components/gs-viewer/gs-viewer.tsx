// @ts-ignore
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useState } from "react";
import * as THREE from "three";
import "./gs-viewer.scss";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export interface GSViewerProps {
  plyPath: String;
  hideModel: boolean;
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
  plyPath,
  hideModel,
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
    if (canvas && plyPath && plyPath.length > 0) {
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

      const gsViewer = new GaussianSplats3D.DropInViewer({
        integerBasedSort: false,
        sphericalHarmonicsDegree: 0,
      });
      gsViewer.addSplatScene(plyPath, {
        progressiveLoad: true,
        format: 1,
        rotation: [rotation_w, rotation_qx, rotation_qy, rotation_qz],
        position: [position_x, position_y, position_z],
      });
      scene.add(gsViewer);

      const render = () => {
        requestAnimationFrame(render);

        if (renderer.domElement.style.display == "none") {
          return;
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
  }, [plyPath, canvas]);

  return (
    <div className="viewer" data-model-path={plyPath}>
      <canvas
        ref={setCanvas}
        style={{ display: hideModel ? "none" : "block" }}
      />
    </div>
  );
};
