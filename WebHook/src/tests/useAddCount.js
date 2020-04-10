import { useState, useRef, useEffect, useMemo } from "react";

export default props => {
  const [count, setCount] = useState(0);
  const obj = useMemo(() => ({ currenCount: 0 }), []);
  const isInit = useRef(true);
  const intervalId = useRef(0);

  obj.currenCount = count;
  if (isInit.current) {
    intervalId.current = setInterval(() => {
      setCount(obj.currenCount + 1);
    }, 1000);
    isInit.current = false;
  }

  useEffect(() => {
    return () => clearInterval(intervalId.current);
  }, []);

  return count;
}