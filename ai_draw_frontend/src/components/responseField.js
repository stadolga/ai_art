import { useSelector } from 'react-redux';

export function ResponseField() {
  const message = useSelector((state) => state.response);
  const error = useSelector((state) => state.error);

  if (error) return (null); // doesnt show response while loading or error is showed
  return (
    <label>{message}</label>
  );
}
