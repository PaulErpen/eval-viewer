// @ts-ignore
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { useRef, useState } from "react";
import * as THREE from "three";
import "./gs-viewer.scss";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export interface GSViewerProps {
  plyPath1: string | null;
  plyPath2: string | null;
  showFirst: boolean;
  isServiceLoading: boolean;
  rotation_w: number;
  rotation_qx: number;
  rotation_qy: number;
  rotation_qz: number;
  position_x: number;
  position_y: number;
  position_z: number;
  fovY: number;
  aspect: number;
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
  isServiceLoading,
  rotation_w,
  rotation_qx,
  rotation_qy,
  rotation_qz,
  position_x,
  position_y,
  position_z,
  fovY,
  aspect,
}: GSViewerProps) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const plyPath1Ref = useRef<string | null>(plyPath1);
  const gsViewer1Ref = useRef<null | any>(null);
  const gsViewer2Ref = useRef<null | any>(null);

  if (
    canvas &&
    !isServiceLoading &&
    plyPath1Ref.current != plyPath1 &&
    plyPath1 &&
    plyPath2
  ) {
    if (gsViewer1Ref.current) {
      gsViewer1Ref.current.dispose();
    }
    if (gsViewer2Ref.current) {
      gsViewer1Ref.current.dispose();
    }

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      canvas,
      alpha: true,
    });
    const camera = new THREE.PerspectiveCamera(fovY, aspect, 0.1, 500);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    camera.position.z = 2;

    gsViewer1Ref.current = createViewer(
      plyPath1,
      rotation_w,
      rotation_qx,
      rotation_qy,
      rotation_qz,
      position_x,
      position_y,
      position_z
    );
    scene.add(gsViewer1Ref.current);

    gsViewer2Ref.current = createViewer(
      plyPath2,
      rotation_w,
      rotation_qx,
      rotation_qy,
      rotation_qz,
      position_x,
      position_y,
      position_z
    );
    scene.add(gsViewer2Ref.current);

    const render = () => {
      requestAnimationFrame(render);

      if (renderer.domElement.dataset.showFirst === "true") {
        gsViewer1Ref.current.visible = true;
        gsViewer2Ref.current.visible = false;
      } else {
        gsViewer1Ref.current.visible = false;
        gsViewer2Ref.current.visible = true;
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

  plyPath1Ref.current = plyPath1;

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
