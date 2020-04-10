import { useState, useMemo, useCallback } from "react";

export default props => {
  const [count, setCount] = useState(0);
  const obj = useMemo(() => ({ isFirst: true }), [])

  const addComponent = useCallback(() => {
    setTimeout(() => {
      setCount(count + 1);
      addComponent();
    }, 1000);
  }, [count]);

  if (obj.isFirst) {
    addComponent();
    obj.isFirst = false;
  }

  return count;
}