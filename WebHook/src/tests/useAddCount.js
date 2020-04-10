import { useState, useRef, useEffect } from "react";

export default props => {
  const [count, setCount] = useState(0);
  const isInit = useRef(true);
  const intervalId = useRef(0);

  if (isInit.current) {
    intervalId.current = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    isInit.current = false;
  }

  useEffect(() => {
    return clearInterval(intervalId.current);
  }, []);

  return count;
}