import React from 'react';
import { useCanvas } from '../CanvasContext';

export function UndoButton() {
  const { cUndo } = useCanvas();

  return <button className="undoButton" onClick={cUndo}>Undo</button>;
}
