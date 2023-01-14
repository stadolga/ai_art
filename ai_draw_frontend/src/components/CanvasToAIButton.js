import React from 'react';
import { useSelector } from 'react-redux';
import { useCanvas } from '../CanvasContext';

export function CanvasToAIButton() {
  const { CanvasToAI } = useCanvas();
  const aiText = useSelector((state) => state.response);
  const loadingMessages = useSelector((state) => state.error);

  const bool = (loadingMessages.includes('Creating the image...') || loadingMessages.includes('Analyzing...'));

  return <button className={`submitButton ${bool ? 'disabled-button' : ''}`} disabled={bool} onClick={CanvasToAI}>Submit</button>;
}
