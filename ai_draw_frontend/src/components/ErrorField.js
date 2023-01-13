import { useSelector } from 'react-redux';

export function ErrorField() {
  const message = useSelector((state) => state.error);
  return (
    <label>{message}</label>
  );
}
