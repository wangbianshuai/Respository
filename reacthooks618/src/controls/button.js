import React, { useState,useCallback } from "react"
import { Button } from "antd"
import Base from './base';

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [isVisible, setIsVisible] = useState(property.isVisible !== false && property.isDataRight !== false);
    const [loading, setLoading] = useState(false);
    const [textType, setTextType] = useState({ text: property.text, buttonType: property.buttonType });
    const [disabled, setDisabled] = useState(property.disabled);

    const clickAction = useCallback(() => {
        pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis]);

    if (!property.setIsVisible) property.setIsVisible = (v) => setIsVisible(v);
    if (!property.setDisabled) property.setDisabled = (v) => setDisabled(v);
    if (!property.setLoading) property.setLoading = (l) => setLoading(l);
    if (!property.setTextType) property.setTextType = (text, type) => setTextType({ text: text, bututonType: type || property.buttonType });

    if (!isVisible) return null;

    const { text, bututonType } = textType;

    return (<Button onClick={clickAction}
        icon={property.Icon}
        disabled={disabled}
        style={property.style}
        shape={property.Shape}
        loading={loading}
        size={property.size}
        prefix={Base.renderPrefix(property)}
        type={bututonType}>{text}</Button>)
};
