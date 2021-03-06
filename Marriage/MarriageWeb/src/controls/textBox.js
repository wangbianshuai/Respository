import React, { useState, useCallback, useEffect } from 'react';
import { Common } from 'UtilsCommon';
import { Input } from 'antd';
import Base from './base';

const { TextArea, Search } = Input;

const setMinMaxValue = (value, property) => {
    if (Common.isNullOrEmpty(value)) return value;

    const { MinValue, MaxValue, dataType } = property;
    if (dataType !== 'int' && dataType !== 'float') return value;

    if (Common.isNullOrEmpty(MinValue) && Common.isNullOrEmpty(MaxValue)) return value;

    const v = Common.getFloatValue(value);

    if (!Common.isNullOrEmpty(MinValue) && v < MinValue) value = MinValue;
    else if (!Common.isNullOrEmpty(MaxValue) && v > MaxValue) value = MaxValue;

    return value;
};

const judgeMinusDot = (value) => {
    if (value === '-') return true;
    if (value === '.') return false;

    if (value.substring(value.length - 1, value.length) === '0') return true;

    if (value.substring(0, value.length - 1).indexOf('.') > 0) return false;

    return value.substring(value.length - 1) === '.';
};

const change = (e, property, setValue) => {
    let value = e.target.value;

    if (value && property.RegExp) value = value.replace(property.RegExp, '')
    if (value && property.dataType === 'float' && !judgeMinusDot(value)) value = Common.getNumber(value, property.scale);
    if (value && property.dataType === 'int') value = Common.getIntValue(value);

    if (value === 0 && e.target.value !== '0') value = '';

    value = setMinMaxValue(value, property);

    setValue(value);
    Base.bindDataValue(property, value);
};

const pressEnter = (property, pageAxis) => {
    const { pressEnterEventActionName, pressEnterEventPropertyName } = property;
    if (pressEnterEventActionName) {
        const props = { pageAxis };
        if (pressEnterEventPropertyName) props.property = pageAxis.getProperty(pressEnterEventPropertyName);
        else props.property = property;

        pageAxis.invokeEventAction(pressEnterEventActionName, props);
    }
}

const valueChange = (property, value) => {
    if (property.valueChange) property.valueChange(value);
};

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(!!property.disabled);
    const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

    const onChange = useCallback((e) => {
        change(e, property, setValue);
    }, [property, setValue]);

    const onPressEnter = useCallback(() => {
        pressEnter(property, pageAxis)
    }, [property, pageAxis]);

    const onSearch = useCallback((searchValue) => {
        pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis, searchValue });
    }, [property, view, pageAxis]);

    useEffect(() => {
        valueChange(property, value);
    }, [property, value]);

    property.setIsVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.setDisabled = (v) => setDisabled(v);
    property.setIsReadOnly = (v) => setIsReadOnly(v);

    if (!isVisible) return null;

    const rows = property.rows || 4;

    if (property.controlType === 'TextArea') {
        const maxLength = isReadOnly ? undefined : property.maxLength || 500;
        return (<TextArea rows={rows}
            placeholder={property.placeHolder}
            onChange={onChange}
            maxLength={maxLength}
            readOnly={isReadOnly}
            disabled={disabled}
            value={value} />)
    }

    if (property.controlType === "Search") {
        return (<Search placeholder={property.placeHolder}
            onChange={onChange}
            maxLength={property.maxLength}
            onSearch={onSearch}
            readOnly={isReadOnly}
            enterButton={property.isEnterButton}
            disabled={disabled}
            value={value} />)
    }

    const type = isReadOnly ? 'text' : (property.controlType || 'text');

    return (
        <Input placeholder={property.placeHolder}
            onChange={onChange}
            maxLength={property.maxLength}
            readOnly={isReadOnly}
            disabled={disabled && !isReadOnly}
            type={type}
            prefix={Base.renderPrefix(property)}
            size={property.size}
            onPressEnter={onPressEnter}
            value={value} />
    );
};