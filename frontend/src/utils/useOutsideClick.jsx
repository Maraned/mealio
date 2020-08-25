import { useEffect } from "react";

const useOutsideClick = (element, callback) => {
  const handleClick = e => {
    if (!element?.contains?.(e.target)) {
      callback(e);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;
