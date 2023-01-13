import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateImage } from '../reducers/imageReducer';
import { useRef , useState, useEffect} from 'react';
import {getStableDiffusionImage} from '../services/apiService';
import { updateResponse } from '../reducers/responseReducer';
import { updateError } from '../reducers/errorReducer';

export function StableDiffusionButton() {
  const button = useRef(null)
  const dispatch = useDispatch()
  const aiText = useSelector(state => state.response)
  const loadingMessages = useSelector(state => state.error)
  const [intervalId, setIntervalId] = useState(null); // add this line 

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);


  const bool = aiText === "" || (loadingMessages.includes("Creating the image...") || loadingMessages.includes("Analyzing..."))

  const handleSubmission = () => {
    let seconds = 0;

    const intervalId = setInterval(() => { //creates a counter
        seconds++;
        dispatch(updateError(`Creating the image... (Time elapsed: ${seconds}s)`));
    }, 1000);
    setIntervalId(intervalId);
    
    getStableDiffusionImage(aiText)
        .then((response) => {
            clearInterval(intervalId);
            dispatch(updateError(""));
            dispatch(updateImage(response));
        })
        .catch((error) => {
            console.log(error);
            clearInterval(intervalId);
            dispatch(updateError("Image creation failed. This is most likely due to AI generating NSFW content. Try again."));
        });
    }


    return <button ref={button} className={`button1 ${bool ? "disabled-button" : ""}`} onClick={handleSubmission} disabled={bool}>Send to Stable Diffusion</button>;
  
}
