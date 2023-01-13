import { useSelector } from 'react-redux';

export function ResponseField() {
  const message = useSelector((state) => state.response);
  const error = useSelector((state) => state.error);
  if(error)return(null)
  return (
    <label>{message}</label>
  );
}
