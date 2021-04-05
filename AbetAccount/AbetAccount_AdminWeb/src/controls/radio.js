import React, { useState, useCallback, useEffect } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import { Radio, Input } from 'antd';
import Base from './base';

const RadioGroup = Radio.Group
const RadioButton = Radio.Button;

const getOptions = (property, view, pageAxis, parentValue) => {
  Base.setValueTextName(property);

  const { isButton, buttonWidth, dataSource, valueName, textName } = property;

  const options = [];

  dataSource.forEach(d => {
    if (isButton) {
      const style = {}
      if (buttonWidth) {
        style.width = buttonWidth;
        style.textAlign = 'center';
      }
      options.push(<RadioButton style={style} value={d[valueName]} key={d[valueName]}>{d[textName]}</RadioButton>)
    }
    else options.push(<Radio value={d[valueName]} key={d[valueName]}>{d[textName]}</Radio>)
  });

  return options;
};

const getSelectText = (property, value) => {
  Base.setValueTextName(property);
  const { valueName, textName } = property;
  const d = Common.arrayFirst(property.DataSource, (f) => Common.IsEquals(f[valueName], value));
  return d === null ? '' : d[textName]
};

const valueChange = (property, view, value) => {
  Base.childPropertiesChanged(property, view, value);
  if (property.valueChange) property.valueChange(value, Base.getSelectData(property, value));

  if (property.valueVisibleProperties) Base.setValueVisibleProperties(property, view, value);
  if (property.selectDataToProperties) Base.setSelectDataToProperties(property, view, Base.getSelectData(property, value));
};

export default (props) => {
  const { property, view, pageAxis } = Base.getProps(props);

  const [value, setValue] = useState(Base.getInitValue(property));
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);
  const [disabled, setDisabled] = useState(!!property.disabled);

  const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

  const onChange = useCallback((e) => {
    property.isChanged = true;
    setValue(e.target.value)
  }, [property, setValue]);

  useEffect(() => {
    valueChange(property, view, value);
  }, [property, view, value]);

  property.setIsVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => Base.getValue(property, value);
  property.setDisabled = (v) => setDisabled(v);
  property.setIsReadOnly = (v) => setIsReadOnly(v);
  property.setParentValue = (v) => setOptions(getOptions(property, view, pageAxis, v));
  property.refreshOptions = (v) => setOptions(getOptions(property, view, pageAxis));

  if (!isVisible) return null;

  const value2 = Common.isNullOrEmpty(value) ? undefined : value;

  if (isReadOnly) {
    if (property.label) {
      const text = getSelectText(property, value);

      return <Input readOnly={isReadOnly}
        type='text'
        value={text} />
    }
    else {
      return (<RadioGroup disabled={disabled}
        value={value2} style={property.style}>{options}</RadioGroup>)
    }
  }

  return (<RadioGroup disabled={disabled}
    value={value} style={property.style}
    onChange={onChange}
    defaultValue={property.defaultValue} >{options}</RadioGroup>)
}