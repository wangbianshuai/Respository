import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import { Checkbox, List, Button } from 'antd-mobile';
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

const renderOptions = (options, value, onChange) => {
    return options.map((m, i) => <Checkbox.CheckboxItem key={i}
        checked={value.includes(m.value)} onChange={(e) => onChange(e, m)}>{m.label}</Checkbox.CheckboxItem >)
};

const getSelectValues = (options, value) => {
    const list = options.filter(f => value.includes(f.value));
    return <List.Item className={styles.divOptionValue}>
        {list.length > 0 && list.map((m, i) => <span key={i}>{m.label}</span>)}
        {list.length === 0 && <label>未有选择项</label>}
    </List.Item>
};

const valueChange = (property, view, pageAxis, value) => {
    if (property.valueChange) property.valueChange(value, Base.getSelectData(property, value));

    if (property.valueVisibleProperties) Base.setValueVisibleProperties(property, view, value);
};

const getValue = (property, v) => {
    if (Common.isNullOrEmpty(v)) return [];

    if (property.isJson) return JSON.parse(v);
    return v.split(',');
}

const renderHeader = (label, collapse, onClick, isNullable) => {
    const butonText = collapse ? '展开' : '收起';
    return <div className={styles.divGroupHeader}>
        <span>{label}{isNullable === false ? <span style={{ color: 'red' }}>*</span> : ''}</span>
        <Button size='small' type='ghost' onClick={onClick} className={styles.button}>{butonText}</Button>
    </div>
}

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const initValue = useMemo(() => getValue(property, property.value), [property]);

    const [value, setValue] = useState(initValue);
    const [collapse, setCollapse] = useState(false);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    const onChange = useCallback((e, m) => {
        let value2 = value;
        if (value2.includes(m.value)) value2 = value.filter(f => !Common.isEquals(f, m.value))
        else {
            value2 = value2.map(m => m);
            value2.push(m.value);
        }
        setValue(value2);
    }, [setValue, value]);

    useEffect(() => {
        valueChange(property, view, pageAxis, value);
    }, [property, view, pageAxis, value]);

    const onClick = useCallback(() => {
        setCollapse(!collapse);
    }, [setCollapse, collapse]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(getValue(property, v));
    property.getValue = () => Base.getValue(property, value);
    property.refreshOptions = (v) => setOptions(getOptions(property, view, pageAxis));
    property.setIsReadOnly = (v) => setIsReadOnly(v);

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);
    const { isList, label, isNullable } = property;

    if (isReadOnly) {
        return (<List className={className} style={property.style} renderHeader={() => label}>
            {getSelectValues(options, value)}
        </List>)
    }

    if (isList) {
        return (<List className={className} style={property.style} renderHeader={() => renderHeader(label, collapse, onClick, isNullable)}>
            {!collapse && renderOptions(options, value, onChange)}
            {collapse && getSelectValues(options, value)}
        </List>)
    }

    return (<div className={className} style={property.style} >
        {renderOptions(options, value, onChange)}</div>)
}