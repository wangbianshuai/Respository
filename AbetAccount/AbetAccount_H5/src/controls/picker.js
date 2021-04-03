import React, { useState, useCallback, useEffect } from 'react';
import { Picker, List, InputItem } from 'antd-mobile';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import Base from './base';
import styles from '../styles/view.scss';

const getOptions = (property, view, pageAxis, parentValue) => {
  parentValue = parentValue || property.parentValue;

  Base.setValueTextName(property);
  const { valueName, textName } = property;

  const options = [];

  const { emptyOption, dataSource } = property;
  if (emptyOption) options.push(emptyOption);

  let value = null, text = null;
  Common.isArray(dataSource) && dataSource.forEach(d => {
    text = d[textName];
    value = d[valueName];

    if (Base.judgePush(d, parentValue, property, view)) {
      options.push({ value, label: text });
    }
  });

  return options;
};

const valueChange = (property, view, pageAxis, value) => {
  if (property.valueChange) property.valueChange(value, Base.getSelectData(property, value));

  if (property.selectDataToProperties) Base.setSelectDataToProperties(property, view, Base.getSelectData(property, value));

  if (property.valueChangeEventActionName) {
    if (!Common.isEquals(property.value2, value)) {
      pageAxis.invokeEventAction(property.valueChangeEventActionName, { property, view, pageAxis });
    }
    property.value2 = value;
  }
};

const exists = (options, value) => {
  return !!Common.arrayFirst(options, (f) => Common.isEquals(f.value, value, true));
}

const getText = (options, value) => {
  var item = Common.arrayFirst(options, (f) => Common.isEquals(f.value, value, true));
  if (item === null) return '';
  return item.label;
};

export default (props) => {
  const { property, view, pageAxis } = Base.getProps(props);

  const [value, setValue] = useState(Base.getInitValue(property));
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [disabled, setDisabled] = useState(!!property.disabled);
  const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

  const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

  const onChange = useCallback((vs) => {
    const v = vs[0];
    setValue(v);
    Base.bindDataValue(property, v);
  }, [property, setValue]);

  useEffect(() => {
    valueChange(property, view, pageAxis, value);
  }, [property, view, pageAxis, value]);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => Base.getValue(property, value);
  property.setDisabled = (v) => setDisabled(v);
  property.setParentValue = (v) => setOptions(getOptions(property, view, pageAxis, v));
  property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));
  property.setIsReadOnly = (v) => setIsReadOnly(v);

  if (!isVisible) return null;

  if (isReadOnly) property.isNullable = true;

  let extra = "请选择" + (property.isNullable === false ? "" : "(可选)");

  const className = Base.getClassName(property, styles);

  const { style, label, defaultValue, emptyOption, isNullable, isRed } = property;

  let value2 = Common.isNullOrEmpty(value) ? emptyOption ? [emptyOption.value] : [] : [value];

  if (emptyOption && emptyOption.label) extra = emptyOption.label;

  if (!exists(options, value)) value2 = [];

  if (property.isLabelItem) {
    if (isReadOnly) {
      const text = getText(options, value);
      return (
        <React.Fragment>
          <List.Item className={styles.divLabelItem}>{label}</List.Item>
          <InputItem className={className} style={style}
            editable={!isReadOnly}
            type='text'
            value={text}></InputItem>
        </React.Fragment>
      )
    }
    return (
      <div className={className} style={style}>
        <List.Item className={styles.divLabelItem}>{label}{isNullable === false ? <span style={{ color: 'red' }}>*</span> : ''}</List.Item>
        <Picker disabled={disabled}
          value={value2}
          cascade={false}
          onChange={onChange}
          onOk={onChange}
          data={[options]}
          title={label}
          extra={<span style={{ color: '#888' }}>{extra}</span>}
          defaultValue={defaultValue}>
          <List.Item arrow="horizontal"> </List.Item>
        </Picker>
      </div>
    )
  }

  if (isReadOnly) {
    const text = getText(options, value);
    return (<InputItem className={className} style={style}
      editable={!isReadOnly}
      type='text'
      value={text}>{label}</InputItem>
    );
  }

  return (
    <div className={className} style={style}>
      <Picker disabled={disabled}
        value={value2}
        cascade={false}
        onChange={onChange}
        onOk={onChange}
        data={[options]}
        title={label}
        extra={<span style={{ color: '#888' }}>{extra}</span>}
        defaultValue={defaultValue}>
        <List.Item arrow="horizontal">{label}{isNullable === false && isRed ? <span style={{ color: 'red' }}>*</span> : ''}</List.Item>
      </Picker>
    </div>
  )

}