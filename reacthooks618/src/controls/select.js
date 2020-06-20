import React, { useState, useCallback, useEffect } from 'react';
import { Select } from 'antd';
import { Common } from 'UtilsCommon';
import { useGetServiceDataSource } from 'UseHooks';
import Base from './base';
const Option = Select.Option;

const getOptions = (property, view, dataList, parentValue) => {
    const { serviceDataSource } = property;
    let valueName = 'value';
    let textName = 'text';

    if (serviceDataSource && serviceDataSource.valueName) valueName = serviceDataSource.valueName;
    else if (property.valueName) valueName = property.valueName;
    if (serviceDataSource && serviceDataSource.textName) textName = serviceDataSource.textName;
    else if (property.textName) textName = property.textName;

    const options = [];

    const { emptyOption, isNullable } = property;
    if (emptyOption) {
        const disabled = !isNullable && !emptyOption.isNullable;
        options.push(<Option value={emptyOption.Value} disabled={disabled} key={Common.createGuid()}>{emptyOption.text}</Option>);
    }

    let value = null, text = null;
    Common.isArray(dataList) && dataList.forEach(d => {
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
    const [options, setOptions] = useState([]);

    const dataList = useGetServiceDataSource(property, view, pageAxis);

    useEffect(() => {
        setOptions(getOptions(property, view, dataList));
    }, [property, view, dataList]);

    const onChange = useCallback((v) => {
        setValue(v);
        Base.bindDataValue(property, v);
    }, [property, setValue]);

    property.setIsVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => value;
    property.setDisabled = (v) => setDisabled(v);
    property.setParentValue = (v) => setOptions(getOptions(property, view, dataList, v));

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