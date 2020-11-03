import React, { useState, useCallback } from 'react';
import { SearchBar } from 'antd-mobile';
import Base from './base';

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(!!property.disabled);

    const onChange = useCallback((v) => {
        setValue(v);
    }, [property, setValue]);

    const onSubmit = useCallback((v) => {
        if (props.onSubmit) props.onSubmit(v);
        else if (pageAxis) pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis, props.onSubmit]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.setDisabled = (v) => setDisabled(v);

    if (!isVisible) return null;

    return (
        <SearchBar placeholder={property.placeHolder}
            onChange={onChange}
            maxLength={property.maxLength || 50}
            disabled={disabled}
            onSubmit={onSubmit}
            defaultValue={props.defaultValue || property.defaultValue}
            value={value === null ? props.value || '' : value} />
    );
};