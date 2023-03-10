import React, {
  useContext, useRef, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { PhotoshopPicker } from 'react-color';
import imageCompression from 'browser-image-compression';

import { updateResponse } from './reducers/responseReducer';
import { updateVisible } from './reducers/visibleReducer';
import { updateError } from './reducers/errorReducer';

import { predictWithServer} from './services/apiService';
import { capitalizeFirstLetter } from './utils/utils';

const CanvasContext = React.createContext();

export function CanvasProvider({ children }) { // Basically the main logic element of frontend,handles canvas and some button functionality
  const [isDrawing, setIsDrawing] = useState(false);

  const [color, setColor] = useState({
    r: 2, g: 1, b: 1, a: 1,
  });

  let oldColor = { // used when canceling colorpicker
    r: 1, g: 1, b: 1, a: 1,
  };

  const [brush, setBrush] = useState(5);
  const [cPushArray, setCPushArray] = useState([]); // Storing undo images
  const [cStep, setCStep] = useState(-1); // storing undo steps
  let status = "Initializing" 

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => { // set style
    contextRef.current.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    contextRef.current.lineWidth = brush;
  }, [color, brush]);

  function blobToBase64(blob) { // turns compresses blob back to 64
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  function dataURLtoFile(dataurl, filename) { // converts picture to blob - compressing
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth / 1.3}px`;
    canvas.style.height = `${window.innerHeight / 1.6}px`;

    // Mobile functionality
    canvasRef.current.addEventListener('touchstart', startDrawing, { passive: false });
    canvasRef.current.addEventListener('touchmove', draw, { passive: false });
    canvasRef.current.addEventListener('touchend', cPush(), { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    }, false);

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    contextRef.current = context;
  };

  const startDrawing = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    event.returnValue = false;
    let x; let y;
    if (event.touches) {
      x = (event.touches[0].clientX - rect.left) * 1.3;
      y = (event.touches[0].clientY - rect.top) * 1.6;
    } else {
      x = event.nativeEvent.offsetX * 1.3;
      y = event.nativeEvent.offsetY * 1.6;
    }
    if (contextRef.current === null) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    const rect = canvasRef.current.getBoundingClientRect(); //get for canvas scaling
    event.returnValue = false;
    if (!isDrawing) {
      return;
    }
    let x; let y;
    if (event.touches) {
      x = (event.touches[0].clientX - rect.left) * 1.3;
      y = (event.touches[0].clientY - rect.top) * 1.6;
    } else {
      x = event.nativeEvent.offsetX * 1.3;
      y = event.nativeEvent.offsetY * 1.6;
    }
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const finishDrawing = (event) => {
    event.returnValue = false;
    if(isDrawing)cPush(); //there is mouse event that ends line when cursor escapes canvas, dont want this function to be called then as no new line is drawn.
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    dispatch(updateResponse('')); // Analysis/message emptied
    dispatch(updateError('')); // same with errors
    setCPushArray([]);
    setCStep(-1);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const cPush = () => {
    setCStep(Math.min(cStep + 1, cPushArray.length)); //if cstep is larger set it to array lenght
    setCPushArray([...cPushArray.slice(0, cStep + 1), canvasRef.current.toDataURL()]); //add new element
  };

  const cUndo = () => {
    if (cStep <= 0) { //if undoing last line
      clearCanvas();
      return;
    }
    const image = new Image();
    image.src = cPushArray[cStep - 1]; //this is important as state always doesn't update straight away, guarentees that right picture is picked.
    image.onload = function () {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      contextRef.current.drawImage(this, 0, 0);
      setCStep(cStep - 1);
    };
  };

  async function CanvasToAI() { // loads the ai text prompt
    dispatch(updateError(''));
    let seconds = 0;
    const interval = setInterval(() => { // creates a counter
      seconds++;
      if (seconds > 45) {
        dispatch(updateError(`${capitalizeFirstLetter(status)}... ` + `(AI is busier than expected, please wait. Time elapsed: ${seconds}s.)`));
      } else {
        dispatch(updateError(`${capitalizeFirstLetter(status)}... ` + `(Time elapsed: ${seconds}s)`));
      }
    }, 1000);

    const statusMessage = (message) => { //has to be this way because services is not react component
      status = message //hooks are async so they don't update fast enough
    }
  

    const options = {
      maxSizeMB: 1, // Maximum photo size that api accepts is 1mb
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const canvas = canvasRef.current;
    const picture = canvas.toDataURL('image/png', 0.5); // png is only file type that works with AI, only one supported with all browsers
    const file = dataURLtoFile(picture, 'file.png'); // convert image to blob so it can be compressed
    const compressedFile = await imageCompression(file, options); // compressing, gives a blob back
    const compressedFileToB64 = await blobToBase64(compressedFile); // turn this blob to a b64 so ai can analyze it
    predictWithServer(compressedFileToB64, statusMessage)
      .then((res) => {
        dispatch(updateError(''));
        dispatch(updateResponse(res));
        clearInterval(interval);
      })
      .catch((error) => {
        if (error.code === 'ECONNABORTED') {
          dispatch(updateError('Connection timed out. Please try again.'));
        } else {
          dispatch(updateError('Error occurred with the server. Please try again.'));
        }
        clearInterval(interval);
        console.log(error);
      });
  }

  class ColorPicker extends React.Component {
    handleChangeComplete = (color) => {
      setColor(color.rgb);
    };

    handleAccept = () => {
      oldColor = color;
      dispatch(updateVisible(false)); // Control togglable buttons
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
        cUndo,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => useContext(CanvasContext);
