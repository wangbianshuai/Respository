import React, { useCallback, useState } from 'react'
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import { AutoComplete } from 'antd'
import Base from './base';

const getOptions = (property, view, pageAxis, parentValue) => {
    parentValue = parentValue || property.parentValue;

    const { dataSource } = property;

    const { textName } = Base.getValueTextName(property);

    const options = [];

    Common.isArray(dataSource) && dataSource.forEach(d => {
        Base.judgePush(d, parentValue, property, view) && options.push(d[textName])
    });

    return options;
};

// const getSelectData = (value, dataSource, textName) => {
//     if (Common.isNullOrEmpty(value)) return null;

//     return Common.arrayFirst(dataSource, f => Common.isEquals(f[textName], value));
// }

// const valueChange = (value, property, dataSource, textName) => {
//     if (property.valueChange) property.valueChange(value);

//     if (property.SelectDataToProperties) property.SelectDataToProperties(getSelectData(value, dataSource, textName));
// };

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [inputValue, setInputValue] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    property.setIsVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.setDisabled = (v) => setDisabled(v);
    property.setIsReadOnly = (v) => setIsReadOnly(v);
    property.setParentValue = (v) => setOptions(getOptions(property, view, pageAxis, v));
    property.refreshOptions = (v) => setOptions(getOptions(property, view, pageAxis));

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