import React, {
  useContext, useRef, useState, useEffect,
} from 'react';
import { PhotoshopPicker } from 'react-color';
import { useDispatch } from 'react-redux';
import fetchApi from './services/apiService';
import { updateResponse } from './reducers/responseReducer';
import { updateVisible } from './reducers/visibleReducer';
import { ImageCompressor } from 'image-compressor';

const CanvasContext = React.createContext();

export function CanvasProvider({ children }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState({
    r: 1, g: 1, b: 1, a: 1,
  });
  const [brush, setBrush] = useState(5);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const dispatch = useDispatch();
  let oldColor = {
    r: 1, g: 1, b: 1, a: 1,
  };

  useEffect(() => {
    contextRef.current.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    contextRef.current.lineWidth = brush;
  }, [color, brush]);

  useEffect(() => { //Mobile functionality
    const canvas = canvasRef.current;
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', finishDrawing);
    return () => {
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', finishDrawing);
    };
  }, []);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth / 1.5}px`;
    canvas.style.height = `${window.innerHeight / 1.5}px`;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    contextRef.current = context;
  };


  const startDrawing = (event) => {
    event.preventDefault();
    let x, y;
    if ('ontouchstart' in window) {
      x = event.touches[0].clientX * 1.5;
      y = event.touches[0].clientY * 1.5;
      console.log(x,y)
    } else {
      x = event.nativeEvent.offsetX * 1.5;
      y = event.nativeEvent.offsetY * 1.5;
    }
    if (contextRef.current === null) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    event.preventDefault();
    if (!isDrawing) {
      return;
    }
    let x, y;
    if ('ontouchstart' in window) {
      x = event.touches[0].clientX * 1.5;
      y = event.touches[0].clientY * 1.5;
    } else {
      x = event.nativeEvent.offsetX * 1.5;
      y = event.nativeEvent.offsetY * 1.5;
    }
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    dispatch(updateResponse(''));
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  async function CanvasToAI() {
    const canvas = canvasRef.current;
    const img = canvas.toDataURL('image/png');
    const options = {
        quality: 0.1
    }
    const compressor = new ImageCompressor();
    const compressedImg = await compressor.compress(img, options);
    dispatch(updateResponse('Analyzing...'));
    fetchApi(compressedImg).then((res) => {
      dispatch(updateResponse(res));
    });
}


  class ColorPicker extends React.Component {
    handleChangeComplete = (color) => {
      setColor(color.rgb);
    };

    handleAccept = () => {
      oldColor = color;
      dispatch(updateVisible(false));
    };

    handleCancel = () => {
      setColor(oldColor);
      dispatch(updateVisible(false));
    };

    render() {
      return (
        <PhotoshopPicker
          color={color}
          onChangeComplete={this.handleChangeComplete}
          onAccept={this.handleAccept}
          onCancel={this.handleCancel}
        />
      );
    }
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        clearCanvas,
        draw,
        CanvasToAI,
        ColorPicker,
        setBrush,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => useContext(CanvasContext);
