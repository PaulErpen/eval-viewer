import "./camera-controls-panel.scss";

export const CameraControlsPanel = () => {
  return (
    <div className="camera-controls-panel">
      <span>
        <b>Camera Controls</b>
      </span>
      <br />
      <br />
      <div>
        <div className="img-wrapper">
          <img src="/wasd.png" />
        </div>
        <span>to move the camera</span>
      </div>
      <div>
        <div className="img-wrapper">
          <img src="/left-click.png" />
        </div>
        <span>to rotate the camera</span>
      </div>
      <div>
        <div className="img-wrapper">
          <img src="/scroll.png" />
        </div>
        <span>to zoom the camera</span>
      </div>
    </div>
  );
};
