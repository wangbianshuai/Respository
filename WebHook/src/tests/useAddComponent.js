import { useState, useMemo } from "react";

export default props => {
  const [count, setCount] = useState(0);
  const obj = useMemo(() => ({ isFirst: true }), [])

  if (obj.isFirst) {
    setInterval(() => {
      setCount(count + 1);
    }, 1000);
    obj.isFirst = false;
  }

  return count;
}