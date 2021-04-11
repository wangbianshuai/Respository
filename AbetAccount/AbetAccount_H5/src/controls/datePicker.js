import React, { useState, useCallback, useEffect } from 'react';
import { DatePicker, InputItem, List } from 'antd-mobile';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/view.scss';

const valueChange = (property, view, pageAxis, value) => {
    if (property.valueChange) property.valueChange(value);
};

const getMomentValue = (property, value) => {
    if (!Common.isNullOrEmpty(value)) {
        if (property.isShowTime) value = Common.convertToDate(value, "yyyy-MM-dd HH:mm:ss")
        else value = Common.convertToDate(value, "yyyy-MM-dd")
    }

    return Common.isNullOrEmpty(value) ? null : value;
}

const getDefaultValue = (property) => {
    if (Common.isNullOrEmpty(property.defaultValue) && property.isDefaultNow) {
        return getMomentValue(property, Common.getCurrentDate())
    }
    return null;
}

const getMinDate = (year) => {
    if (!year) return undefined;

    return new Date(year, 1, 1, 0, 0, 0)
}

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(!!property.disabled);
    const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

    const onChange = useCallback((v) => {
        const value2 = Common.getDateString(v, !property.isShowTime)
        setValue(value2);
        Base.bindDataValue(property, value2);
    }, [property, setValue]);

    useEffect(() => {
        valueChange(property, view, pageAxis, value);
    }, [property, view, pageAxis, value]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.setDisabled = (v) => setDisabled(v);
    property.setIsReadOnly = (v) => setIsReadOnly(v);

    if (!isVisible) return null;

    let extra = "请选择" + (property.isNullable === false ? "" : "(可选)");

    const className = Base.getClassName(property, styles);

    const { style, label, isShowTime, maxLength, placeholder, isNullable, isRed, minYear } = property;

    const mv = getMomentValue(property, value);

    if (isReadOnly) {
        return (<InputItem className={className} style={style}
            editable={!isReadOnly}
            type='text'
            value={value}>{label}</InputItem>
        );
    }

    return (
        <div className={className} style={style}>
            <DatePicker placeholder={placeholder}
                onChange={onChange}
                onOk={onChange}
                maxLength={maxLength}
                disabled={disabled}
                minDate={getMinDate(minYear)}
                mode={isShowTime ? "datetime" : "date"}
                format={isShowTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
                title={label}
                extra={extra}
                value={mv}>
                <List.Item arrow="horizontal">{label}{isNullable === false && isRed ? <span style={{ color: 'red' }}>*</span> : ''}</List.Item>
            </DatePicker>
        </div>
    )
}

