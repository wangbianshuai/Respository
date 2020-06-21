import React, { useState, useCallback } from 'react';
import { Select } from 'antd';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import Base from './base';
const Option = Select.Option;

const getOptions = (property, view, pageAxis, parentValue) => {
    parentValue = parentValue || property.parentValue;

    const { valueName, textName } = Base.getValueTextName(property);

    const options = [];

    const { emptyOption, isNullable, dataSource } = property;
    if (emptyOption) {
        const disabled = !isNullable && !emptyOption.isNullable;
        options.push(<Option value={emptyOption.Value} disabled={disabled} key={Common.createGuid()}>{emptyOption.text}</Option>);
    }

    let value = null, text = null;
    Common.isArray(dataSource) && dataSource.forEach(d => {
        text = d[textName];
        value = d[valueName];

        if (Base.judgePush(d, parentValue, property, view)) options.push(<Option value={value} key={value}>{text}</Option>)
    });

    return options;
}

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(false);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    const onChange = useCallback((v) => {
        setValue(v);
        Base.bindDataValue(property, v);
    }, [property, setValue]);

    property.setIsVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.setDisabled = (v) => setDisabled(v);
    property.setParentValue = (v) => setOptions(getOptions(property, view, pageAxis, v));
    property.refreshOptions = (v) => setOptions(getOptions(property, view, pageAxis));

    if (!isVisible) return null;

    const width = property.width || '100%'

    return (<Select disabled={disabled}
        style={{ width }}
        value={value}
        onChange={onChange}
        allowClear={!!property.allowClear}
        mode={property.mode}
        maxTagCount={property.maxTagCount}
        placeholder={property.placeHolder}
        showSearch={property.isSearch}
        filterOption={false}
        notFoundContent={null}
        defaultValue={property.defaultValue} >{options}</Select>)
}