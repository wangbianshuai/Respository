import { useState, useMemo, useCallback } from "react";
import { Input } from "antd";

export default props => {
  const [list, setList] = useState([]);
  const obj = useMemo(() => ({ isFirst: true }), [])

  const addComponent = useCallback(() => {
    setTimeout(() => {
      list.push(<Input />);
      setList(list);
      addComponent();
    }, 1000);
  }, [list]);

  if (obj.isFirst) {
    addComponent();
    obj.isFirst = false;
  }

  return list;
}