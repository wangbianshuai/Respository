import React, { useCallback } from "react"
import { usePageAxis } from "UseHooks";

export default (props) => {
    const { property, view, pageId } = props;
    const pageAxis = usePageAxis.getPageAxis(pageId);

    const clickAction = useCallback(() => {
        pageAxis.invokeEventAction(property.EventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis]);


    const { label, text, dataText, href, style } = property
    let text2 = dataText;
    text2 = text || (label || text)

    return (<a onClick={clickAction} style={style} href={href}>{text2}</a>)
}