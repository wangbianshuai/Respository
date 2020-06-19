import React, { useState, useCallback } from 'react';
import { Select } from 'antd';
//import { Common } from 'UtilsCommon';
import Base from './base';
//const Option = Select.Option;

// const getOptions = (parentValue, inputValue, property) => {
//     const options = [];
//     const valueList = [];
//     const { textName, valueName } = property;

//     const { emptyOption, IsNullable } = property;
//     if (emptyOption) {
//         const disabled = !IsNullable && !emptyOption.IsNullable;
//         options.push(<Option value={emptyOption.Value} disabled={disabled} key={Common.createGuid()}>{emptyOption.text}</Option>);
//         valueList.push(emptyOption.Value);
//     }

//     let value = null, text = null;
//     Common.IsArray(property.dataSource) && property.dataSource.forEach(d => {
//         text = d[textName];
//         value = d[valueName];

//         options.push(<Option value={value} key={value}>{text}</Option>)
//         valueList.push(value);
//     });

//     return options;
// }

export default (props) => {
    const { property } = Base.getProps(props);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(false);
    const [options] = useState([]);

    const onChange = useCallback((e) => {
        //change(e, property, setValue);
    }, []);

    if (!property.setIsVisible) property.setIsVisible = (v) => setIsVisible(v);
    if (!property.setValue) property.setValue = (v) => setValue(v);
    if (!property.setDisabled) property.setDisabled = (v) => setDisabled(v);

    if (!isVisible) return null;

    const width = property.Width || '100%'

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