import React from 'react';
import { useCanvas } from '../CanvasContext';

export function ClearCanvasButton() {
  const { clearCanvas } = useCanvas();
  return <button className="resetButton" onClick={clearCanvas}>reset</button>;
}
