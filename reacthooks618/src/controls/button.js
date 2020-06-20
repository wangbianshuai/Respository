import React, { useState, useCallback } from "react"
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

    property.setIsVisible = (v) => setIsVisible(v);
    property.setDisabled = (v) => setDisabled(v);
    property.setLoading = (l) => setLoading(l);
    property.setTextType = (text, type) => setTextType({ text: text, buttonType: type || property.buttonType });

    if (!isVisible) return null;

    const { text, buttonType } = textType;

    return (<Button onClick={clickAction}
        icon={property.Icon}
        disabled={disabled}
        style={property.style}
        shape={property.Shape}
        loading={loading}
        size={property.size}
        prefix={Base.renderPrefix(property)}
        type={buttonType}>{text}</Button>)
};
