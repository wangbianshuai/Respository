import React, { useState, useCallback, useEffect } from 'react';
import { DatePicker, List } from 'antd-mobile';
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

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(!!property.disabled);

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

    if (!isVisible) return null;

    let extra = "请选择" + (property.isNullable === false ? "" : "(可选)");

    const className = Base.getClassName(property, styles);

    const { style, label, isShowTime, maxLength, placeholder, isNullable, isRed } = property;

    const mv = getMomentValue(property, value);

    return (
        <div className={className} style={style}>
            <DatePicker placeholder={placeholder}
                onChange={onChange}
                onOk={onChange}
                maxLength={maxLength}
                disabled={disabled}
                mode={isShowTime ? "datetime" : "date"}
                defaultValue={getDefaultValue(property)}
                format={isShowTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
                title={label}
                extra={extra}
                value={mv}>
                <List.Item arrow="horizontal">{label}{isNullable === false && isRed ? <span style={{ color: 'red' }}>*</span> : ''}</List.Item>
            </DatePicker>
        </div>
    )
}

