import React, { useState } from 'react';
import { useCanvas } from '../CanvasContext';

export function Slider() {
  const { setBrush } = useCanvas();
  const [value, setValue] = useState(10);
  function updateTextInput(val) {
    setValue(val);
  }

  return (
    <div className="slider">
      <i className="fa fa-paint-brush" />
      <input type="range" id="slider" value={value} min="0" max="150" onChange={(e) => { setBrush(e.target.valueAsNumber); updateTextInput(e.target.valueAsNumber); }} />
    </div>
  );
}
