import React from 'react';
import { useSelector } from 'react-redux';
import { useCanvas } from '../CanvasContext';

export function ClearCanvasButton() {
  const loadingMessages = useSelector((state) => state.error); // Disable buttons when loading, prevents errors
  const bool = (loadingMessages) && (loadingMessages.includes('Creating the image...') || loadingMessages.includes('Analyzing...'));

  const { clearCanvas } = useCanvas();
  return <button className={`resetButton ${bool ? 'disabled-button' : ''}`} disabled={bool} onClick={clearCanvas}>Reset</button>;
}
