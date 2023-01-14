import { useSelector } from 'react-redux';

export function ErrorField() {
  const message = useSelector((state) => state.error);
  console.log(message, "!!!")
  return (
    <label>{message}</label>
  );
}
