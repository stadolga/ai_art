import React, {
  useContext, useRef, useState, useEffect,
} from 'react';
import { PhotoshopPicker } from 'react-color';
import { useDispatch } from 'react-redux';
import fetchApi from './services/apiService';
import { updateResponse } from './reducers/responseReducer';
import { updateVisible } from './reducers/visibleReducer';
import { setUndo,addUndo } from './reducers/undoReducer';
import { useSelector } from 'react-redux';

const CanvasContext = React.createContext();

export function CanvasProvider({ children }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState({
    r: 2, g: 1, b: 1, a: 1,
  });
  const [brush, setBrush] = useState(5);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const dispatch = useDispatch();
  let oldColor = {
    r: 1, g: 1, b: 1, a: 1,
  };
  const [cPushArray, setCPushArray] = useState([]);
const [cStep, setCStep] = useState(-2);

  const undoList = useSelector(state => state.undo)

  useEffect(() => {
    contextRef.current.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    contextRef.current.lineWidth = brush;
  }, [color, brush]);

  const cPush = () => {
    setCStep(cStep + 1);
    if (cStep < cPushArray.length) { setCPushArray(cPushArray.slice(0, cStep)); }
    setCPushArray([...cPushArray, canvasRef.current.toDataURL()]);
    }
    
    const cUndo = () => {
    if (cStep === 0) {clearCanvas(); return;}
    setCStep(cStep - 2);
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    let image = new Image();
    image.src = cPushArray[cStep];
    image.onload = function() {
      contextRef.current.drawImage(this, 0, 0);
      };
    }

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
    cPush();
    const x = event.nativeEvent.offsetX * 1.5;
    const y = event.nativeEvent.offsetY * 1.5;
    if (contextRef.current === null) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);

    const currentDrawing = {
      color: color,
      brush: brush,
      x: x,
      y: y
      }
    dispatch(addUndo(currentDrawing))
    setIsDrawing(true);
  };

  const draw = (event) => {
    event.preventDefault();
    if (!isDrawing) {
      return;
    }
    const x = event.nativeEvent.offsetX * 1.5;
    const y = event.nativeEvent.offsetY * 1.5;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const finishDrawing = (event) => {
    const x = event.nativeEvent.offsetX * 1.5;
    const y = event.nativeEvent.offsetY * 1.5;
    cPush();
    const currentDrawing = {
      color: color,
      brush: brush,
      x: x,
      y: y
      }
    dispatch(addUndo(currentDrawing))
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    dispatch(updateResponse(''));
    setUndo([])
    setCPushArray([])
    setCStep(-2)
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
	

  async function CanvasToAI() {
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL('image/png');

    dispatch(updateResponse('Analyzing...')); //get response
    fetchApi(imgData)
    .then((res) => {
      console.log(res)
      dispatch(updateResponse(res));
    })
    .catch((e =>{
      dispatch(updateResponse("Error! Please try again."))
    }))
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
        undo,
        cUndo
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => useContext(CanvasContext);
