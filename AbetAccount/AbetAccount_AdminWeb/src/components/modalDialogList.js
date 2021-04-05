import React, { useState } from "react";
import ModalDialog from './modalDialog';

const add = (item, list, setList) => {
    list = list.map(m => m);
    list.push(item);
    setList(list);
}

export default React.memo((props) => {
    const [list, setList] = useState([]);

    const { property } = props;
    property.add = (c) => add(c, list, setList);

    return list.map(m => <ModalDialog key={m.id} property={m} />);
});