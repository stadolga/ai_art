import { useSelector } from 'react-redux';

export function ResponseField() {
  const message = useSelector((state) => state.response);
  return (
    <label>{message}</label>
  );
}
