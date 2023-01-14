import React, { useState } from 'react';

function ToolTipComponent() {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = (e) => {
    if (e.target.className === 'fa fa-question') {
      setOpen(!isOpen);
    }
  };
  return (
    <div>
      <button className="infoButton" onClick={toggleOpen} onTouchStart={toggleOpen} onTouchEnd={toggleOpen}>
        <i className="fa fa-question" />
      </button>
      {isOpen && (
        <div className="tooltip-box">
          <label>Use the application by drawing something on the canvas by pressing with your mouse or finger.</label>
          <label>You can undo your latest line by pressing undo, press "reset" to reset the canvas. Undo may not work correctly on your mobile device.</label>
          <p>Slider changes the size of the brush, "Change color" changes the color of the brush.</p>

          <label>Press "submit" to get the AI analysis of your drawing, this can take anywhere from 2-100 seconds depending on how busy the server is.</label>
          <label>Press "Send to Stable Diffusion" to get Stable Diffusion-generated version of your drawing. You must submit first to use this feature.</label>
        </div>
      )}
    </div>
  );
}

export { ToolTipComponent };
