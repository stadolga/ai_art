import React, { useState } from 'react';

function ToolTipComponent() {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      <div className="infoButtonContainer">
        <button
          className="infoButton"
          onMouseEnter={() => { setOpen(true); }}
          onMouseLeave={() => { setOpen(false); }}
          onTouchStart={() => { setOpen(true); }}
          onTouchEnd={() => { setOpen(false); }}
        >
          <i className="fa fa-info" />
        </button>
      </div>
      {isOpen && (
        <div className="tooltip-box">
          <label>Use the application by drawing something on the canvas by pressing with your mouse or finger.</label>
          <label>You can undo your latest line by pressing undo, press "reset" to reset the canvas.</label>
          <p>Slider changes the size of the brush, "Change color" allows you to select the color of the brush.</p>

          <label>Press "Analyze drawing" to get the AI text analysis of your drawing, this can take anywhere from 2-100 seconds depending on how busy the server is.</label>
          <label>Press "Redraw with AI" to get AI(Stable Diffusion)-generated version of your drawing. You must analyze the drawing first to use this feature.</label>
        </div>
      )}
    </div>
  );
}

export { ToolTipComponent };
