import { useSelector, useDispatch } from 'react-redux'
import { updateImage } from "../reducers/imageReducer"

function ImageComponent() {
  const imageLink = useSelector(state => state.image)
  const aiText = useSelector(state => state.response)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(updateImage(""))
  }

  if(imageLink==="") return(null)
  
  return (
    <div className="aiDiv">
      <img src={imageLink} alt="Uploaded Image" />
        <div className='result-box'>
        <label className="ai-text">{aiText}</label>
        <button className="button1" onClick={handleClose}>OK</button>
      </div>
    </div>
  )
}

export {ImageComponent}
