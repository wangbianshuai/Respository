import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Select } from 'antd';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import Base from './base';
const Option = Select.Option;

const judgeSearch = (inputValue, text) => {
    if (Common.isNullOrEmpty(inputValue)) return true;
    else if (text && text.toString().toLowerCase().indexOf(inputValue.toLowerCase()) >= 0) return true;
    return false;
};

const getOptions = (property, view, pageAxis, parentValue) => {
    parentValue = parentValue || property.parentValue;

    Base.setValueTextName(property);
    const { valueName, textName } = property;

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

        if (Base.judgePush(d, parentValue, property, view) && judgeSearch(property.inputValue, text)) {
            options.push(<Option value={value} key={value}>{text}</Option>);
        }
    });

    return options;
};

const stopTimeout = (obj) => {
    if (obj.timeoutId > 0) clearTimeout(obj.timeoutId);
}

const search = (property) => {
    property.refreshOptions();
};

const valueChange = (property, view, value) => {
    if (property.valueChange) property.valueChange(value, Base.getSelectData(property, value));

    if (property.valueVisibleProperties) Base.setValueVisibleProperties(property, view, value);
    if (property.selectDataToProperties) Base.setSelectDataToProperties(property, view, Base.getSelectData(property, value));
};

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false || property.isFormItem);
    const [disabled, setDisabled] = useState(!!property.disabled);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    const obj = useMemo(() => ({}), [])

    const onChange = useCallback((v) => {
        setValue(v);
        Base.bindDataValue(property, v);
    }, [property, setValue]);

    const onSerach = useCallback((v) => {
        property.inputValue = v;
        stopTimeout(obj);
        obj.timeoutId = setTimeout(() => search(property), 300);
    }, [property, obj]);

    useEffect(() => {
        valueChange(property, view, value);
    }, [property, view, value]);

    useEffect(() => () => stopTimeout(obj), [obj]);

    property.setIsVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
    property.setDisabled = (v) => setDisabled(v);
    property.setParentValue = (v) => setOptions(getOptions(property, view, pageAxis, v));
    property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));

    if (!isVisible) return null;

    const width = property.width || '100%'

    if (property.isMultiple) {
        let valueList = Common.isNullOrEmpty(value) ? [] : value;
        if (!Common.isArray(valueList)) valueList = valueList.split(",");

        return (
            <Select disabled={disabled}
                style={{ width: width }}
                value={valueList}
                onChange={onChange}
                allowClear={!!property.allowClear}
                mode={"multiple"}
                maxTagCount={property.maxTagCount}
                placeholder={property.placeHolder}
                defaultValue={property.defaultValue} >{options}</Select>)
    }

    return (<Select disabled={disabled}
        style={{ width }}
        value={value === null ? undefined : value}
        onChange={onChange}
        allowClear={!!property.allowClear}
        mode={property.mode}
        maxTagCount={property.maxTagCount}
        placeholder={property.placeHolder}
        showSearch={property.isSearch}
        filterOption={false}
        onSearch={property.isSearch ? onSerach : null}
        notFoundContent={null}
        defaultValue={property.defaultValue} >{options}</Select>)
}