import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateImage } from '../reducers/imageReducer';
import { useRef , useState, useEffect} from 'react';
import {getStableDiffusionImage} from '../services/apiService';
import { updateResponse } from '../reducers/responseReducer';

export function StableDiffusionButton() {
  const button = useRef(null)
  const dispatch = useDispatch()
  const aiText = useSelector(state => state.response)
  const [intervalId, setIntervalId] = useState(null); // add this line 

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);

  const bool = (aiText === "" || aiText==="Draw something for the AI to analyze!" || aiText.includes("Analyzing...")) //is button available
  if(bool){
    button.disabled = true
  } else{
    button.disabled = false
  }

  const handleSubmission = () => {
    let seconds = 0;
    const intervalId = setInterval(() => {
        seconds++;
        dispatch(updateResponse(`Creating the image... (Time elapsed: ${seconds}s)`));
    }, 1000);
    setIntervalId(intervalId);
    getStableDiffusionImage(aiText)
        .then((response) => {
            clearInterval(intervalId);
            dispatch(updateResponse(aiText));
            dispatch(updateImage(response));
        })
        .catch((error) => {
            console.log(error);
            clearInterval(intervalId);
            dispatch(updateResponse("Image creation failed. This is most likely due to AI generating NSFW content. Try again."));
        });
    }


    return <button ref={button} className={`button1 ${bool ? "disabled-button" : ""}`} onClick={handleSubmission} disabled={bool}>Send to Stable Diffusion</button>;
  
}
