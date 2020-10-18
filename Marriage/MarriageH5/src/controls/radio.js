import React, { useState, useCallback, useEffect } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import { Radio, List } from 'antd-mobile';
import Base from './base';
import styles from '../styles/view.scss';

const getOptions = (property, view, pageAxis, parentValue) => {
    Base.setValueTextName(property);

    const { dataSource, valueName, textName } = property;

    const options = [];

    dataSource.forEach(d => {
        const value = d[valueName];
        const label = d[textName];
        options.push({ value, label })
    });

    return options;
};

const getChecked = (value1, value2) => {
    return Common.isEquals(value1, value2, true);
};

const renderOptions = (options, defaultValue, name, value, onChange) => {
    return options.map((m, i) => <Radio defaultChecked={getChecked(defaultValue, m.value)} name={name} key={i}
        checked={getChecked(value, m.value)} onChange={(e) => onChange(e, m)}><span>{m.label}</span></Radio>)
};

const renderOptions2 = (options, defaultValue, name, value, onChange) => {
    return options.map((m, i) => <Radio.RadioItem defaultChecked={getChecked(defaultValue, m.value)} name={name} key={i}
        checked={getChecked(value, m.value)} onChange={(e) => onChange(e, m)}><span>{m.label}</span></Radio.RadioItem>)
};

const valueChange = (property, view, pageAxis, value) => {
    if (property.valueChange) property.valueChange(value, Base.getSelectData(property, value));

    if (property.valueVisibleProperties) Base.setValueVisibleProperties(property, view, value);
};

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    const onChange = useCallback((e, m) => {
        setValue(m.value)
    }, [setValue]);

    useEffect(() => {
        valueChange(property, view, pageAxis, value);
    }, [property, view, pageAxis, value]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.refreshOptions = (v) => setOptions(getOptions(property, view, pageAxis));

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);
    const { defaultValue, name, isLabelItem, isListItem, label, isNullable } = property;

    if (isListItem) {
        return (<List.Item className={className} style={property.style} >
            {renderOptions(options, defaultValue, name, value, onChange)}</List.Item>)
    }

    if (isLabelItem) {
        return (<List className={className} style={property.style} renderHeader={() => {
            return <div className={styles.divLabel}><span>{label}{isNullable === false ? <span style={{ color: 'red' }}>*</span> : ''}</span></div>
        }}>
            {renderOptions2(options, defaultValue, name, value, onChange)}</List>)
    }
    else {
        return (<div className={className} style={property.style} >
            {label && <div className={styles.divLeft}><span>{label}：</span></div>}
            <div className={styles.divRight}>{renderOptions(options, defaultValue, name, value, onChange)}</div></div>)
    }
}