import React from 'react';
import { useCanvas } from '../CanvasContext';
import {useSelector} from 'react-redux'


export function ClearCanvasButton() {
  const loadingMessages = useSelector(state => state.error)
  const bool = (loadingMessages)&&(loadingMessages.includes("Creating the image...") || loadingMessages.includes("Analyzing..."))

  const { clearCanvas } = useCanvas();
  return <button className={`resetButton ${bool ? "disabled-button" : ""}`} disabled={bool} onClick={clearCanvas}>Reset</button>;
}
