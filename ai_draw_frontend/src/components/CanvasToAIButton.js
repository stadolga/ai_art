import React from 'react';
import { useCanvas } from '../CanvasContext';

export function CanvasToAIButton() {
  const { CanvasToAI } = useCanvas();

  return <button className="submitButton" onClick={CanvasToAI}>Submit</button>;
}
