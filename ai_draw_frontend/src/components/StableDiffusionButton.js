import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateImage } from '../reducers/imageReducer';
import { getStableDiffusionImage} from '../services/apiService';
import { updateError } from '../reducers/errorReducer';
import { capitalizeFirstLetter } from '../utils/utils';
import { updateResponse } from '../reducers/responseReducer';

export function StableDiffusionButton() {
  const button = useRef(null);
  const dispatch = useDispatch();
  let status = "Initializing"
  const aiText = useSelector((state) => state.response);
  const loadingMessages = useSelector((state) => state.error);

  const bool = aiText === '' || aiText.includes('Draw something with mouse or touch on the canvas above for the AI to analyze!')
   || loadingMessages.includes('Time elapsed:');

  const handleSubmission = () => {
    let seconds = 0;

    const interval = setInterval(() => { // creates a counter
      seconds++;
      if (seconds > 45) {
        dispatch(updateError(`${capitalizeFirstLetter(status)}... ` + `(AI is busier than expected, please wait. Time elapsed: ${seconds}s.)`));
      } else {
        dispatch(updateError(`${capitalizeFirstLetter(status)}... ` + `(Time elapsed: ${seconds}s)`));
      } // updates response field
    }, 1000);

    const statusMessage = (message) => { //has to be this way because services is not react component
      status = message //hooks are async so they don't update fast enough
    }

    getStableDiffusionImage(aiText, statusMessage)
      .then((response) => {
        clearInterval(interval);
        dispatch(updateError(''));
        dispatch(updateResponse(response.input.prompt))
        dispatch(updateImage(response.output[0]));
      })
      .catch((error) => {
        dispatch(updateError("NSFW content detected, AI didn't generate an image. Please try again, this usually fixes the problem."))
        clearInterval(interval);
      });
  };

  return <button ref={button} className={`submitButton ${bool ? 'disabled-button' : ''}`} onClick={handleSubmission} disabled={bool}>Redraw with AI</button>;
}
