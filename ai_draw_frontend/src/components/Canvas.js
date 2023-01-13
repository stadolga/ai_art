import React, { useEffect } from 'react';
import { useCanvas } from '../CanvasContext';

export function Canvas() {
  const {
    canvasRef,
    prepareCanvas,
    startDrawing,
    finishDrawing,
    draw,
  } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <canvas
       className="canvasStyle"
       onMouseDown={startDrawing}
       onMouseUp={finishDrawing}
       onMouseMove={draw}
       onMouseLeave={finishDrawing}
       onTouchStart={startDrawing} //MOBILE FUNCTIONALITY
       onTouchEnd={finishDrawing}
       onTouchMove={draw}
       ref={canvasRef}
     />
    );
}
