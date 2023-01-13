import React, {
  useContext, useRef, useState, useEffect,
} from 'react';
import { PhotoshopPicker } from 'react-color';
import { useDispatch } from 'react-redux';
import {predictWithServer} from './services/apiService';
import { updateResponse } from './reducers/responseReducer';
import { updateVisible } from './reducers/visibleReducer';

const CanvasContext = React.createContext();

export function CanvasProvider({ children }) {
  const [isDrawing, setIsDrawing] = useState(false);

  const [color, setColor] = useState({
    r: 2, g: 1, b: 1, a: 1,
  });

  let oldColor = { //used when canceling colorpicker
    r: 1, g: 1, b: 1, a: 1,
  };

  const [brush, setBrush] = useState(5);
  const [cPushArray, setCPushArray] = useState([]); //Storing undo images
  const [cStep, setCStep] = useState(-1); //storing undo steps
  const [firstUndo,setFirstUndo] = useState(true)
  useEffect(() => cUndo(),[firstUndo])

  

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const dispatch = useDispatch();


  useEffect(() => {
    contextRef.current.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    contextRef.current.lineWidth = brush;
  }, [color, brush]);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth / 1.6}px`;
    canvas.style.height = `${window.innerHeight / 1.6}px`;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    contextRef.current = context;
  };


  const startDrawing = (event) => {
    event.preventDefault();
    const x = event.nativeEvent.offsetX * 1.6;
    const y = event.nativeEvent.offsetY * 1.6;
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
    const x = event.nativeEvent.offsetX * 1.6;
    const y = event.nativeEvent.offsetY * 1.6;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    console.log("here")
    cPush()
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    dispatch(updateResponse(''));
    setCPushArray([])
    setCStep(-1)
    setFirstUndo(true)
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const cPush = () => { //saves image to arr
    setCStep(cStep + 1);
    console.log(cStep, cPushArray.length)
    if (cStep < cPushArray.length) { setCPushArray(cPushArray.slice(1, cStep)); }
    setCPushArray([...cPushArray, canvasRef.current.toDataURL()]);
    }
    
  const cUndo = () => { //Undo, loads picture from array and puts it to canvas
    if(firstUndo && cStep !== -1) {setFirstUndo(false)} //Very very dirty solution to fix a bug where the first undo doesn't work.
    if (!firstUndo && cStep === -1) {clearCanvas(); return;} //reset screen when undo first element
    
    setCStep(cStep -1);
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    let image = new Image();
    image.src = cPushArray[cStep];
    image.onload = function() {
      contextRef.current.drawImage(this, 0, 0);
      };
    }

  async function CanvasToAI() {
    let seconds = 0;
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL('image/png');
    const intervalId = setInterval(() => {
      seconds++;
      dispatch(updateResponse(`Analyzing... (Time elapsed: ${seconds}s)`));
    }, 1000);
      predictWithServer(imgData)
        .then((res) => {
          clearInterval(intervalId);
          console.log(res);
          dispatch(updateResponse(res));
        })
        .catch((e) => {
          clearInterval(intervalId);
          dispatch(updateResponse("Error! Please try again."));
        });
    }
    
  class ColorPicker extends React.Component {
    
    handleChangeComplete = (color) => {
      setColor(color.rgb);
    };

    handleAccept = () => {
      oldColor = color;
      dispatch(updateVisible(false)); //Control togglable buttons
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
        cUndo
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => useContext(CanvasContext);
