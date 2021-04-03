import React, { useCallback, useState, useEffect } from 'react'
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import { AutoComplete } from 'antd'
import Base from './base';

const getOptions = (property, view, pageAxis, parentValue) => {
    parentValue = parentValue || property.parentValue;

    const { dataSource } = property;

    Base.setValueTextName(property);

    const { textName } = property;
    const options = [];

    Common.isArray(dataSource) && dataSource.forEach(d => {
        Base.judgePush(d, parentValue, property, view) && options.push(d[textName])
    });

    return options;
};

const getSelectData = (property, value) => {
    if (Common.isNullOrEmpty(value)) return null;

    const { textName } = property;

    return Common.arrayFirst(property.dataSource, f => Common.isEquals(f[textName], value));
}

const valueChange = (property, value) => {
    if (property.valueChange) property.valueChange(value, getSelectData(property, value));
};

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [inputValue, setInputValue] = useState('');
    const [disabled, setDisabled] = useState(!!property.disabled);
    const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    property.setIsVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.setDisabled = (v) => setDisabled(v);
    property.setIsReadOnly = (v) => setIsReadOnly(v);
    property.setParentValue = (v) => setOptions(getOptions(property, view, pageAxis, v));
    property.refreshOptions = (v) => setOptions(getOptions(property, view, pageAxis));

    useEffect(() => {
        valueChange(property, value);
    }, [property, value]);

    const onChange = useCallback((v) => {
        setValue(v);
        Base.bindDataValue(property, v);
    }, [property, setValue]);

    const onSearch = useCallback((v) => {
        setInputValue(v);
    }, [setInputValue]);

    if (!isVisible) return null;

    const width = property.Width || '100%'

    const value2 = value === null || value === undefined ? '' : value;

    const dataSource = inputValue ? options : [];

    return (<AutoComplete placeholder={property.placeHolder}
        style={{ width }}
        onChange={onChange}
        maxLength={property.maxLength}
        readOnly={isReadOnly}
        dataSource={dataSource}
        disabled={disabled}
        onSearch={onSearch}
        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        value={value2} />)
}