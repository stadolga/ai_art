import { useCanvas } from '../CanvasContext';
import {useSelector} from 'react-redux'

export function UndoButton() {
  const { cUndo } = useCanvas();
  const loadingMessages = useSelector(state => state.error)
  const bool = (loadingMessages)&&(loadingMessages.includes("Creating the image...") || loadingMessages.includes("Analyzing..."))

  return <button className={`undoButton ${bool ? "disabled-button" : ""}`} disabled={bool}onClick={cUndo}>Undo</button>;
}
