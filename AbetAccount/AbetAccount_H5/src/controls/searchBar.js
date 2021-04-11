import React, { useState, useCallback } from 'react';
import { SearchBar } from 'antd-mobile';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/view.scss';

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(!!property.disabled);

    const onChange = useCallback((v) => {
        setValue(v);
    }, [setValue]);

    const onSubmit = useCallback((v) => {
        if (props.onSubmit) props.onSubmit(v);
        else if (pageAxis) pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis, props.onSubmit]);

    const onClear = useCallback(() => {
        window.setTimeout(() => {
            if (props.onSubmit) props.onSubmit(v);
            else if (pageAxis) pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
        }, 100)
    }, [property, view, pageAxis, props.onSubmit]);

    const onCancel = useCallback(() => {
        if (pageAxis) pageAxis.invokeEventAction(property.cancelEventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => !Common.isEquals(v, value) && setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.setDisabled = (v) => setDisabled(v);

    const className = Base.getClassName(property, styles);

    if (!isVisible) return null;

    return (
        <SearchBar placeholder={property.placeHolder}
            onChange={onChange}
            maxLength={property.maxLength || 50}
            disabled={disabled}
            onSubmit={onSubmit}
            cancelText={property.cancelText}
            onCancel={onCancel}
            onClear={onClear}
            className={className}
            showCancelButton={property.showCancelButton}
            defaultValue={props.defaultValue || property.defaultValue}
            value={Common.isNullOrEmpty(value) ? props.value || '' : value} />
    );
};