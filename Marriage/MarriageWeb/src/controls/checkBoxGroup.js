
import React, { useState, useCallback } from 'react';
import { Common } from "UtilsCommon";
import { useGetDataSourceOptions } from 'UseHooks';
import { Checkbox } from "antd"
import Base from './base';
import styles from '../styles/view.css';

const getOptions = (property, view, pageAxis, parentValue) => {
  Base.setValueTextName(property);

  const { dataSource, valueName, textName } = property;

  const options = [];

  dataSource.forEach(d => {
    options.push({ value: d[valueName], label: d[textName] });
  });

  return options;
}

const checkBoxChange = (property, value, setValue) => {
  if (property.isSingleSelection && value && value.length > 1) value = [value[value.length - 1]];

  setValue(value);
}

export default (props) => {
  const { property, view, pageAxis } = Base.getProps(props);

  const [value, setValue] = useState(Base.getInitValue(property));
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);
  const [disabled, setDisabled] = useState(!!property.disabled);

  const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

  const onChange = useCallback((v) => {
    checkBoxChange(property, v, setValue);
  }, [property, setValue]);

  property.setIsVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => Base.getValue(property, value);
  property.setDisabled = (v) => setDisabled(v);
  property.setIsReadOnly = (v) => setIsReadOnly(v);
  property.setParentValue = (v) => setOptions(getOptions(property, view, pageAxis, v));
  property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));

  if (!isVisible) return null;

  let valueList = Common.isNullOrEmpty(value) ? [] : value;
  if (!Common.isArray(valueList)) valueList = valueList.split(",")

  let style;
  if (property.isFlexColumn) {
    style = {
      display: "flex",
      flexDirection: "column",
      lineHeight: "32px"
    };
  }

  const className = Base.getClassName(property, styles);

  if (isReadOnly) {
    let options2 = options.filter(f => valueList.includes(f));

    return <Checkbox.Group value={valueList}
      style={style} className={className}
      options={options2}></Checkbox.Group>
  }
  else {
    return <Checkbox.Group value={valueList}
      style={style}
      disabled={disabled} className={className}
      onChange={onChange} options={options}></Checkbox.Group>
  }
}