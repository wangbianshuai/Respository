import React, { useCallback, useMemo, useState } from 'react';
import { Common } from 'UtilsCommon';
import { Checkbox } from 'antd';
import Base from './base';

const getValue = (property, value) => {
  const { checkedValue, unCheckedValue } = property;
  return value === checkedValue ? checkedValue : unCheckedValue;
};

const checkBoxChange = (e, property, setValue) => {
  const { checkedValue, unCheckedValue } = property;
  const value = e.target.checked ? checkedValue : unCheckedValue

  setValue(value);
  Base.bindDataValue(property, value);
};

export default (props) => {
  const { property } = Base.getProps(props);

  useMemo(() => {
    property.checkedValue = property.checkedValue || 1;
    property.unCheckedValue = property.unCheckedValue || 0;
  }, [property]);

  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState(Base.getInitValue(property));
  const [disabled, setDisabled] = useState(!!property.disabled);
  const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

  const onChange = useCallback((e) => {
    checkBoxChange(e, property, setValue)
  }, [property, setValue]);

  property.setIsVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => getValue(property, value);
  property.setDisabled = (v) => setDisabled(v);
  property.setIsReadOnly = (v) => setIsReadOnly(v);

  if (!isVisible) return null;

  let checked = Common.isNullOrEmpty(value) ? false : value.toString().toLowerCase() === 'true' || Common.isEquals(value, property.checkedValue);

  if (isReadOnly) {
    return <Checkbox checked={checked} style={property.style}>{property.text}</Checkbox>
  }
  else {
    return <Checkbox checked={checked} style={property.style} disabled={disabled}
      onChange={onChange}>{property.text}</Checkbox>
  }
}
