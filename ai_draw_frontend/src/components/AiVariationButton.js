import React from 'react';
import { useCanvas } from '../CanvasContext';
import { useSelector } from 'react-redux';
import { useRef } from 'react';

export function AiVariationButton() {
  const button = useRef(null)
  const aiText = useSelector(state => state.response)

  const bool = (aiText === "" || aiText==="Draw something for the AI to analyze!" || aiText==="Analyzing...")
  if(bool){
    button.disabled = true
  } else{
    button.disabled = false
  }

  const { clearCanvas } = useCanvas();
  return   <button ref={button} className={`button1 ${bool ? "disabled-button" : ""}`} onClick={clearCanvas} disabled={bool}>create variations</button>;

}
