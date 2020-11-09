import React, { useState, useCallback } from "react"
import { Button, List } from "antd-mobile"
import Base from './base';
import styles from '../styles/view.scss';

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [isVisible, setIsVisible] = useState(property.isVisible !== false && property.isDataRight !== false);
    const [loading, setLoading] = useState(false);
    const [textType, setTextType] = useState({ text: property.text, buttonType: property.buttonType });
    const [disabled, setDisabled] = useState(!!property.disabled);

    const clickAction = useCallback(() => {
        pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis]);

    property.setVisible = (v) => setIsVisible(v);
    property.setDisabled = (v) => setDisabled(v);
    property.setLoading = (l) => setLoading(l);
    property.setTextType = (text, type) => setTextType({ text: text, buttonType: type || property.buttonType });

    if (!isVisible) return null;

    const { text, buttonType } = textType;
    const { style, isListItem, divClassName, isDiv } = property;

    const className = Base.getClassName(property, styles);

    const renderButton = () => <Button onClick={clickAction}
        icon={property.icon}
        className={className}
        style={style}
        disabled={disabled}
        style={property.style}
        shape={property.Shape}
        loading={loading}
        size={property.size}
        prefix={Base.renderPrefix(property)}
        type={buttonType}>{text}</Button>;

    if (isListItem) return <List.Item className={styles.divButton}>{renderButton()}</List.Item>
    if (isDiv) return <div className={styles[divClassName]}>{renderButton()}</div>

    return renderButton();
};
