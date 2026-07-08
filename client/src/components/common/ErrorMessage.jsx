// ErrorMessage.jsx — shared inline error display for forms/API failures.
function ErrorMessage({ message }) {
  if (!message) return null;
  return <p role="alert">{message}</p>;
}

export default ErrorMessage;
