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

export const GSViewer = ({ plyPath, hideModel }: GSViewerProps) => {
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
      });
      gsViewer.addSplatScene(plyPath, {
        rotation: [1, 0.0, -0.0, 0.0],
        format: 2,
        progressiveLoad: true,
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
