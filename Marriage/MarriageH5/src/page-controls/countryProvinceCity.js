import React, { useState, useCallback, useEffect } from 'react';
import { Picker, List } from 'antd-mobile';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import Controls from 'Controls';
import styles from '../styles/view.scss';

const getOptions = (property, view, pageAxis, parentValue) => {
    parentValue = parentValue || property.parentValue;

    const { dataSource, isNullable } = property;

    const { CityList } = dataSource;
    const options = isNullable ? [{ value: '', label: '', children: [{ value: '', label: '', children: [{ value: '', label: '' }] }] }] : [];
    let country = null;

    Common.isArray(CityList) && CityList.forEach(d => {
        country = Common.arrayFirst(options, f => f.value === d.CountryUID);
        if (country === null) {
            country = { value: d.CountryUID, label: d.CCnName, children: [{ value: d.ProvinceUID, label: d.PCnName, children: [{ value: d.UID, label: d.CnName }] }] };
            options.push(country);
        }
        else {
            const province = Common.arrayFirst(country.children, f => f.value === d.ProvinceUID)
            if (province == null) country.children.push({ value: d.ProvinceUID, label: d.PCnName, children: [{ value: d.UID, label: d.CnName }] });
            else province.children.push({ value: d.UID, label: d.CnName })
        }
    });

    return options;
};


const getCityValue = (data, cityId) => {
    if (!data || !cityId) return [];
    const { CityList } = data;
    const city = Common.arrayFirst(CityList, f => Common.isEquals(f.UID, cityId));
    if (city) return [city.CountryUID, city.ProvinceUID, city.UID];
    return [];
};

const setCityValue = (property, data, cityId, setValue) => {
    property.value = cityId;
    if (!data) return;
    const { CityList } = data;
    if (!CityList || !CityList) return;

    setValue(getCityValue(data, cityId));
};

export default (props) => {
    const { property, view, pageAxis } = Controls.Base.getProps(props);

    const [value, setValue] = useState([]);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(!!property.disabled);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    const onChange = useCallback((v) => {
        if (v[0] === '') setValue([]);
        else setValue(v);
    }, [property, setValue]);

    useEffect(() => {
        if (value.length === 0 && property.value && property.dataSource) {
            setCityValue(property, property.dataSource, property.value, setValue);
            property.value = null;
        }
    }, [property.dataSource, property.value, value, setValue])

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setCityValue(property, property.dataSource, v, setValue);
    property.getValue = () => value.length === 3 ? value[2] : '';
    property.setDisabled = (v) => setDisabled(v);
    property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));

    if (!isVisible) return null;

    let extra = "请选择" + (property.isNullable === false ? "" : "(可选)");

    const className = Controls.Base.getClassName(property, styles);

    const { style, label, defaultValue, isNullable, isRed } = property;

    return (
        <div className={className} style={style}>
            <Picker disabled={disabled}
                value={value}
                cascade={true}
                onChange={onChange}
                onOk={onChange}
                data={options}
                title={label}
                extra={<span style={{ color: '#888' }}>{extra}</span>}
                defaultValue={defaultValue}>
                <List.Item arrow="horizontal">{label}{isNullable === false && isRed ? <span style={{ color: 'red' }}>*</span> : ''}</List.Item>
            </Picker>
        </div>
    )
}