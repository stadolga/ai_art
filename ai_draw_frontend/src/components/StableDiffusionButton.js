import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateImage } from '../reducers/imageReducer';
import { getStableDiffusionImage, socket } from '../services/apiService';
import { updateError } from '../reducers/errorReducer';
import { capitalizeFirstLetter } from '../utils/utils';

export function StableDiffusionButton() {
  const button = useRef(null);
  const dispatch = useDispatch();
  const aiText = useSelector((state) => state.response);
  const loadingMessages = useSelector((state) => state.error);

  const bool = aiText === '' || aiText.includes('Draw something for the AI to analyze!') || loadingMessages.includes('Creating the image...')
   || loadingMessages.includes('Analyzing...');

  const handleSubmission = () => {
    let seconds = 0;
    let state = 'Initializing';

    const interval = setInterval(() => { // creates a counter
      seconds++;
      dispatch(updateError(`${capitalizeFirstLetter(state)}... ` + `(Time elapsed: ${seconds}s)`)); // updates response field
    }, 1000);

    socket.on('getImage', (data) => { // updates the state from the backend
      state = data.status;
    });

    socket.on('errorImage', (data) => {
      dispatch(updateError(`An error occured! (${data.error}). Please try again.`)); // error handler from backend
    });

    getStableDiffusionImage(aiText)
      .then((response) => {
        clearInterval(interval);
        dispatch(updateError(''));
        dispatch(updateImage(response));
      })
      .catch((error) => {
        console.log(error);
        clearInterval(interval);
      });
  };

  return <button ref={button} className={`button1 ${bool ? 'disabled-button' : ''}`} onClick={handleSubmission} disabled={bool}>Send to Stable Diffusion</button>;
}
