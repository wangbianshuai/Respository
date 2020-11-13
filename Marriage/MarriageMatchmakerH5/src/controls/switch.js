import React, { useState, useCallback, useEffect } from 'react';
import { Common } from 'UtilsCommon';
import { Switch, List } from 'antd-mobile';
import Base from './base';
import styles from '../styles/view.scss';

const valueChange = (property, view, pageAxis, value) => {
  if (property.valueChange) property.valueChange(value, Base.getSelectData(property, value));

  if (property.valueVisibleProperties) Base.setValueVisibleProperties(property, view, value);
};

export default (props) => {
  const { property, view, pageAxis } = Base.getProps(props);

  const [value, setValue] = useState(Base.getInitValue(property) || 0);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [disabled, setDisabled] = useState(!!property.disabled);
  const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

  const onChange = useCallback((checked) => {
    !isReadOnly && setValue(checked ? 1 : 0)
  }, [setValue, isReadOnly]);

  useEffect(() => {
    valueChange(property, view, pageAxis, value);
  }, [property, view, pageAxis, value]);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => Base.getValue(property, value);
  property.setDisabled = (v) => setDisabled(v);
  property.setIsReadOnly = (v) => setIsReadOnly(v);

  if (!isVisible) return null;

  const className = Base.getClassName(property, styles, 'switch');

  let checked = Common.isNullOrEmpty(value) ? false : value.toString().toLowerCase() === "true" || parseInt(value, 10) === 1;

  const { style, label } = property;

  if (isReadOnly) {
    return (<List.Item className={className} style={style} extra={checked ? '是' : '否'}>
      {label}
    </List.Item>
    );
  }

  return (<List.Item className={className} style={property.style} extra={<Switch checked={checked} disabled={disabled} onChange={onChange} />}>
    {property.label}
  </List.Item>)
}

