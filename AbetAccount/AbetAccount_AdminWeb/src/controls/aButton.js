import React, { useCallback } from "react"
import Base from './base';

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const clickAction = useCallback(() => {
        pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis]);


    const { label, text, dataText, href, style } = property;
    let text2 = dataText;
    text2 = text || (label || text)

    return (<a onClick={clickAction} style={style} href={href}>{text2}</a>)
}