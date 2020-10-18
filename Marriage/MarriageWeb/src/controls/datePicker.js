import React, { useState, useCallback, useMemo } from 'react'
import { Common } from 'UtilsCommon';
import { DatePicker } from 'antd'
import moment from 'moment';
import Base from './base';

const getValue = (value) => {
    if (value === undefined) return null
    var value2 = '';
    if (typeof value === 'string') value2 = Common.trim(value);
    else value2 = Common.getDateString(value);
    return value2;
};

const getDataTime = (value, property) => {
    if (Common.isNullOrEmpty(value)) return value;
    if (property.isShowTime) value = moment(value, 'YYYY-MM-DD HH:mm:ss')
    else value = moment(value, 'YYYY-MM-DD')

    return value;
};

const getMomentValue = (value, property) => {
    if (!Common.isNullOrEmpty(value)) {
        if (Common.isArray(value)) value = value.map(m => getDataTime(m, property))
        else value = getDataTime(value, property)
    }

    return Common.isNullOrEmpty(value) ? null : value;
};

const getDefaultValue = (property) => {
    if (Common.isNullOrEmpty(property.defaultValue) && property.isDefaultNow) {
        return getMomentValue(Common.getCurrentDate(), property)
    }
    return null;
};

export default (props) => {
    const { property } = Base.getProps(props);

    useMemo(() => {
        Base.setDefaultValue(property);
    }, [property]);

    const [value, setValue] = useState(Base.getInitValue(property));
    const [disabled, setDisabled] = useState(!!property.disabled);
    const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

    const onChange = useCallback((v, valueString) => {
        setValue(valueString);
        Base.bindDataValue(property, getValue(valueString))
    }, [property, setValue]);

    property.setValue = (v) => setValue(v);
    property.getValue = () => getValue(value);
    property.setDisabled = (v) => setDisabled(v);
    property.setIsReadOnly = (v) => setIsReadOnly(v);

    const width = property.width || '100%'

    const mv = getMomentValue(value, property);

    return (<DatePicker placeholder={property.placeHolder}
        style={{ width }}
        onChange={onChange}
        maxLength={property.maxLength}
        readOnly={isReadOnly}
        disabled={disabled}
        showTime={property.isShowTime}
        defaultValue={getDefaultValue(property)}
        format={property.isShowTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
        value={mv} />)
};
