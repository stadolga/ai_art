import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import { updateVisible } from '../reducers/visibleReducer';

function Togglable(props) {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.visible);

  const toggleVisibility = () => {
    dispatch(updateVisible(!visible));
  };

  return ( // basically hides colorpicker. Could have been implemented other way too (eg. if(colorPickerChose===false) return null)
    <>
      <div>
        <button id="view" onClick={toggleVisibility} className="button1">
          Change color
        </button>
      </div>
      {visible
        && createPortal(
          <div className="modal">
            {props.children}
          </div>,
          document.body,
        )}
    </>
  );
}
export default Togglable;
