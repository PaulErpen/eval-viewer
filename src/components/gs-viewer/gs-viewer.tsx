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
  initialDistance: number;
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
  initialDistance,
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
    const camera = new THREE.PerspectiveCamera(fovY, aspect, 0.5, 500);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    camera.position.z = initialDistance;

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

    const movementSpeed = 0.04; // Adjust as needed
    const moveDirection = { x: 0, y: 0 };

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
          moveDirection.y = 1;
          break;
        case "s":
          moveDirection.y = -1;
          break;
        case "a":
          moveDirection.x = -1;
          break;
        case "d":
          moveDirection.x = 1;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "s":
          moveDirection.y = 0;
          break;
        case "a":
        case "d":
          moveDirection.x = 0;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

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

      // Update camera gimbal center based on WASD input
      if (moveDirection.x !== 0 || moveDirection.y !== 0) {
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();

        camera.getWorldDirection(forward);
        forward.y = 0; // Constrain movement to the XZ plane
        forward.normalize();

        right.crossVectors(forward, camera.up).normalize();

        const offset = new THREE.Vector3()
          .addScaledVector(forward, moveDirection.y * movementSpeed)
          .addScaledVector(right, moveDirection.x * movementSpeed);

        controls.target.add(offset);
        camera.position.add(offset);
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
