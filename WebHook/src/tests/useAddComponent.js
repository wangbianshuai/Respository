import { useState, useEffect, useCallback } from "react";
import { Input } from "antd";

export default props => {
  const [list, setList] = useState([]);

  const addComponent = useCallback(() => {
    setTimeout(() => {
      list.push(<Input />);
      setList(list);
      addComponent();
    }, 1000);
  }, [list]);

  useEffect(() => {
    addComponent();
  }, [addComponent]);

  return list;
}