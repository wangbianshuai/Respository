import { useState, useRef } from "react";

export default props => {
  const [count, setCount] = useState(0);
  const isInit = useRef(true)

  if (isInit.current) {
    setInterval(() => {
      setCount(count + 1);
    }, 1000);
    isInit.current = false;
  }

  return count;
}