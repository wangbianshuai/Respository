import React, { useCallback, useEffect, useState } from 'react'
import { Common } from 'UtilsCommon';
import { useGetServiceDataSource } from 'UseHooks';
import { AutoComplete } from 'antd'
import Base from './base';

const getOptions = (parentValue, dataList, property, view, textName) => {
    const options = [];

    Common.isArray(dataList) && dataList.forEach(d => {
        Base.judgePush(d, parentValue, property, view) && options.push(d[textName])
    });

    return options;
};

// const getSelectData = (value, dataList, textName) => {
//     if (Common.isNullOrEmpty(value)) return null;

//     return Common.arrayFirst(dataList, f => Common.isEquals(f[textName], value));
// }

// const valueChange = (value, property, dataList, textName) => {
//     if (property.valueChange) property.valueChange(value);

//     if (property.SelectDataToProperties) property.SelectDataToProperties(getSelectData(value, dataList, textName));
// };

export default (props) => {
    const { property, view } = Base.getProps(props);

    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    if (!property.setIsVisible) property.setIsVisible = (v) => setIsVisible(v);
    if (!property.setValue) property.setValue = (v) => setValue(v);
    if (!property.setDisabled) property.setDisabled = (v) => setDisabled(v);
    if (!property.setIsReadOnly) property.setIsReadOnly = (v) => setIsReadOnly(v);

    const dataList = useGetServiceDataSource(props);
    const textName = property.textName;

    useEffect(() => {
        setOptions(getOptions(null, dataList, property, view, textName))
    }, [dataList, property, view, textName])

    const onChange = useCallback((v) => {
        setValue(v);
        Base.bindDataValue(v);
    }, [setValue]);

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