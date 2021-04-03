import React, { useState, useCallback, useEffect } from 'react';
import { Common } from 'UtilsCommon';
import { InputItem, TextareaItem, List } from 'antd-mobile';
import Base from './base';
import styles from '../styles/view.scss';

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

const change = (value, property, setValue) => {
    if (value && property.regExp) value = value.replace(new RegExp(property.regExp, 'ig'), '')
    if (value && property.dataType === 'float' && !judgeMinusDot(value)) value = Common.getNumber(value, property.scale);
    if (value && property.dataType === 'int') value = Common.getIntValue(value);

    if (value === 0 && value !== '0') value = '';

    value = setMinMaxValue(value, property);

    setValue(value);
    Base.bindDataValue(property, value);
};

const valueChange = (property, value) => {
    if (property.valueChange) property.valueChange(value);
};

export default (props) => {
    const { property } = Base.getProps(props);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(!!property.disabled);
    const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

    const onChange = useCallback((v) => {
        change(v, property, setValue);
    }, [property, setValue]);

    useEffect(() => {
        valueChange(property, value);
    }, [property, value]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.setDisabled = (v) => setDisabled(v);
    property.setIsReadOnly = (v) => setIsReadOnly(v);

    if (!isVisible) return null;

    const { label, extra, style, clear, isLabelItem, isRed, rows, isValueVisible } = property;
    let isNullable = property.isNullable

    if (isValueVisible && !value) return null;

    const type = isReadOnly ? 'text' : (property.controlType || 'text');

    const className = Base.getClassName(property, styles);

    let clear2 = clear === undefined ? true : clear;
    if (isReadOnly || disabled) clear2 = false;

    let isRed2 = property.isRed2 || (isNullable === false && isRed);
    if (isReadOnly) {
        isRed2 = false;
        isNullable = true;
        property.placeHolder = ''
    }

    const label2 = property.isLabel === false ? '' : label;

    if (isLabelItem) {
        if (property.controlType === 'textarea') {
            return (
                <React.Fragment>
                    <List.Item className={styles.divLabelItem}>{label}{isNullable === false ? <span style={{ color: 'red' }}>*</span> : ''}</List.Item>
                    <TextareaItem placeholder={property.placeHolder}
                        autoHeight={true}
                        className={className}
                        style={style}
                        onChange={onChange}
                        maxLength={property.maxLength}
                        editable={!isReadOnly}
                        disabled={disabled && !isReadOnly}
                        clear={clear2}
                        value={value} />
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <List.Item className={styles.divLabelItem}>{label}{isNullable === false ? <span style={{ color: 'red' }}>*</span> : ''}</List.Item>
                <InputItem placeholder={property.placeHolder}
                    className={className} style={style}
                    onChange={onChange}
                    maxLength={property.maxLength}
                    editable={!isReadOnly}
                    disabled={disabled && !isReadOnly}
                    type={type}
                    clear={clear2}
                    extra={extra}
                    value={value}></InputItem>
            </React.Fragment>
        );
    }
    else {
        if (property.controlType === 'textarea') {
            return (<TextareaItem placeholder={property.placeHolder}
                rows={rows || 4}
                className={className}
                style={style}
                onChange={onChange}
                maxLength={property.maxLength}
                editable={!isReadOnly}
                disabled={disabled && !isReadOnly}
                clear={clear2}
                title={<span>{label2}{isRed2 ? <span style={{ color: 'red' }}>*</span> : ''}</span>}
                value={value} />
            );
        }

        return (<InputItem placeholder={property.placeHolder}
            className={className} style={style}
            onChange={onChange}
            maxLength={property.maxLength}
            editable={!isReadOnly}
            disabled={disabled && !isReadOnly}
            type={type}
            clear={clear2}
            extra={extra}
            value={value}>{label2}{isRed2 ? <span style={{ color: 'red' }}>*</span> : ''}</InputItem>
        );
    }
};