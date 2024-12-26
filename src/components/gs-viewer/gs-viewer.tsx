import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./gs-viewer.scss";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export interface GSViewerProps {
  plyPath: String;
}

export const GSViewer = ({ plyPath }: GSViewerProps) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvas && plyPath && plyPath.length > 0) {
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        canvas,
      });
      const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 500);

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      camera.position.z = 2;

      const gsViewer = new GaussianSplats3D.DropInViewer({
        selfDrivenMode: false,
        useBuiltInControls: false,
        renderer,
        camera,
        gpuAcceleratedSort: true,
      });
      gsViewer.addSplatScenes([
        {
          path: plyPath,
          rotation: [-0.14724434, -0.0761755, 0.1410657, 0.97602],
          scale: [1.5, 1.5, 1.5],
          position: [-3, -2, -3.2],
          splatAlphaRemovalThreshold: 20,
        },
      ]);
      scene.add(gsViewer);
      console.log("Added scene " + plyPath);

      // BoxGeometry
      const geometry = new THREE.PlaneGeometry(15.0, 15.0, 15.0);
      geometry.translate(0, 0, -20.0);
      geometry.rotateX(-Math.PI / 2);
      const material = new THREE.MeshBasicMaterial({ color: 0x6a7d3d });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      const render = () => {
        requestAnimationFrame(render);

        controls.update();

        renderer.render(scene, camera);
      };
      requestAnimationFrame(render);
    }
  }, [plyPath, canvas]);

  return (
    <div className="viewer">
      <canvas ref={setCanvas} />
    </div>
  );
};
