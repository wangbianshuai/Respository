import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import Base from './base';
import styles from '../styles/view.scss';

const getOptions = (property, view, pageAxis, parentValue) => {
    parentValue = parentValue || property.parentValue;

    Base.setValueTextName(property);
    const { valueName, textName } = property;

    const options = [];

    const { emptyOption, dataSource } = property;
    if (emptyOption) options.push(emptyOption);

    let value = null, text = null;
    Common.isArray(dataSource) && dataSource.forEach(d => {
        text = d[textName];
        value = d[valueName];

        if (Base.judgePush(d, parentValue, property, view)) {
            options.push({ value, label: text });
        }
    });

    return options;
};

const valueChange = (property, view, pageAxis, value) => {
    if (property.valueChange) property.valueChange(value, Base.getSelectData(property, value));

    if (property.selectDataToProperties) Base.setSelectDataToProperties(property, view, Base.getSelectData(property, value));

    if (property.valueChangeEventActionName) {
        if (!Common.isEquals(property.value2, value)) {
            pageAxis.invokeEventAction(property.valueChangeEventActionName, { property, view, pageAxis });
        }
        property.value2 = value;
    }
};

const renderLi = (data, index, value, onChange) => {
    const selected = Common.isEquals(data.value, value)
    return <li key={index} className={selected ? styles.selected : ''} onClick={() => onChange(data.value)}><span>{data.label}</span></li>
}

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    const ul = useRef(null);

    const onChange = useCallback((v) => {
        setValue(v);
        Base.bindDataValue(property, v);
    }, [property, setValue]);

    useEffect(() => {
        valueChange(property, view, pageAxis, value);
    }, [property, view, pageAxis, value]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.setParentValue = (v) => setOptions(getOptions(property, view, pageAxis, v));
    property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));

    if (!isVisible) return null;

    const { emptyOption } = property;

    let value2 = Common.isNullOrEmpty(value) ? emptyOption ? emptyOption.value : '' : value;

    const className = Base.getClassName(property, styles);

    const { style } = property;

    return (
        <div className={className} style={style}>
            <ul ref={ul}>{options.map((m, i) => renderLi(m, i, value2, onChange))}</ul>
        </div>
    )
}