import React, {
  useContext, useRef, useState, useEffect,
} from 'react';
import { PhotoshopPicker } from 'react-color';
import { useDispatch } from 'react-redux';
import {predictWithServer} from './services/apiService';
import { updateResponse } from './reducers/responseReducer';
import { updateVisible } from './reducers/visibleReducer';
import { updateError } from './reducers/errorReducer';
import Compressor from 'compressorjs';

const CanvasContext = React.createContext();

export function CanvasProvider({ children }) { //Basically the main logic element of frontend, handles canvas and some button functionality
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
  const [firstUndo,setFirstUndo] = useState(true) //for fixing a glitch where first undo doesn't work
  useEffect(() => cUndo(),[firstUndo])

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const dispatch = useDispatch();


  useEffect(() => { //set style
    contextRef.current.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    contextRef.current.lineWidth = brush;
  }, [color, brush]);

  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  function dataURLtoFile(dataurl, filename) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth / 1.3}px`;
    canvas.style.height = `${window.innerHeight / 1.6}px`;

    //Mobile functionality
    canvasRef.current.addEventListener("touchstart", startDrawing, { passive: false });
    canvasRef.current.addEventListener("touchmove", draw, { passive: false });
    canvasRef.current.addEventListener("touchend", finishDrawing, { passive: false });

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    contextRef.current = context;
  };


  const startDrawing = (event) => {
    event.returnValue = false
    let x, y;
    if (event.touches) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY * 1.6;
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
    event.returnValue = false
    if (!isDrawing) {
      return;
    }
    let x, y;
    if (event.touches) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY * 1.6;
    } else {
      x = event.nativeEvent.offsetX * 1.3;
      y = event.nativeEvent.offsetY * 1.6;
    }
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const finishDrawing = (event) => {
    event.returnValue = false
    cPush()
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    dispatch(updateResponse('')); //Analysis/message emptied
    dispatch(updateError('')); //same with errors
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
    if (cStep < cPushArray.length) { setCPushArray(cPushArray.slice(1, cStep)); }
    setCPushArray([...cPushArray, canvasRef.current.toDataURL()]);
    }
    
  const cUndo = () => { //Undo, loads picture from array and puts it to canvas
    if(firstUndo && cStep !== -1) {setFirstUndo(false)} //Very very dirty solution to fix a bug where the first undo doesn't work.
    if (!firstUndo && cStep === -1) {clearCanvas(); return;} //reset screen when undo first element
    if(cPushArray[cStep] === undefined) return; //when initializing there is sometimes problem that this fixes
  
    setCStep(cStep -1);
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    let image = new Image();
    image.src = cPushArray[cStep];
    image.onload = function() {
      contextRef.current.drawImage(this, 0, 0);
      };
    }

  async function CanvasToAI() { //loads the ai text prompt
    let seconds = 0;
    const canvas = canvasRef.current;
    const picture = canvas.toDataURL('image/jpeg', 0.9);
    const file = dataURLtoFile(picture, 'file.jpeg')
    
    const intervalId = setInterval(() => {
      seconds++;
      dispatch(updateError(`Analyzing... (Time elapsed: ${seconds}s)`));
    }, 1000);

    new Compressor(file, {
      quality: 0.2,  
      // The compression process is asynchronous,
      success(result) {
        blobToBase64(result).then(base64data => {
    
          predictWithServer(base64data)
          .then((res) => {
            console.log(res)
            clearInterval(intervalId);
            dispatch(updateResponse(res));
            dispatch(updateError(""))
          })
          .catch((e) => {
            console.log(e)
            clearInterval(intervalId);
            dispatch(updateError("Error! Please try again."));
          });
        })
      },
      error(err) {
        console.log(err.message);
      },
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
