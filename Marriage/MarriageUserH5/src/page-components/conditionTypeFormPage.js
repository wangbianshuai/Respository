import React, { useState, useEffect } from 'react';
import Components from 'Components';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';
import { List } from 'antd-mobile';

const getTextBox = (item, selectType) => {
  const { Value } = item;
  const dataType = item.DataType === 'number' ? 'float' : 'string';
  const maxLength = item.DataType === 'number' ? 10 : 100;
  const controlType = item.DataType === 'number' ? '' : 'textarea';
  const placeHolder = selectType === 1 ? '可选填' : '可选值(输入选择的关键字，多个以逗号或顿号隔开)'
  return { name: item.ItemId, value: Value, isLabelItem: true, autoHeight: true, dataType, controlType, scale: 2, type: 'TextBox', maxLength, placeHolder, label: item.Title, isEdit: true };
}

const getIntervalTextBox = (item) => {
  const { Value } = item;
  return { name: item.ItemId, dataType: 'float', value: Value, isLabelItem: true, scale: 2, type: 'IntervalTextBox', maxLength: 10, placeHolder: '可选填', label: item.Title, isEdit: true };
};

const getCheckBoxGroup = (item) => {
  const { Value } = item;
  return { name: item.ItemId, value: Value, type: 'CheckBoxGroup', isJson: true, nullTipMessage: '请选择' + item.Title, isList: true, label: item.Title, dataSource: item.DataSourceItems, isEdit: true };
}

const getPicker = (item) => {
  const { Value } = item;
  return { name: item.ItemId, value: Value, isLabelItem: true, className: 'divPicker', type: 'Picker', label: item.Title, dataSource: item.DataSourceItems, isEdit: true };
}

const formItemToProperty = (item, i, property, pageAxis) => {
  const { selectType } = property;
  if (selectType === 1) {
    if (item.IsSingle && item.DataSourceItems) return getPicker(item);
    else if (!item.IsSingle && item.DataSourceItems) return getCheckBoxGroup(item);
    else if (item.IsInterval) return getIntervalTextBox(item);
    return getTextBox(item, selectType);
  }
  else {
    if (item.DataSourceItems) return getCheckBoxGroup(item);
    else if (item.IsInterval || item.DataType === 'number') return getIntervalTextBox(item);
    return getTextBox(item, selectType);
  }
};

const getProperties = (itemList, property, pageAxis) => {
  return itemList.map((m, i) => formItemToProperty(m, i, property, pageAxis));
};

const getPropertiesValues = (properties) => {
  var dataList = [];

  properties.forEach(p => {
    const v = p.getValue();

    if (!Common.isNullOrEmpty(v)) {
      dataList.push({
        ItemId: p.name,
        Value: v.toString()
      });
    }
  })

  return dataList;
}

const judgeValueRange = (properties) => {
  let msg = '';
  let p;
  for (let i = 0; i < properties.length; i++) {
    p = properties[i];
    if (p.judgeValueRange) {
      msg = p.judgeValueRange();
      if (!Common.isNullOrEmpty(msg)) break;
    }
    else if (p.type === 'TextBox' && p.dataType !== 'float') {
      var v = p.getValue();
      if (!Common.isNullOrEmpty(v) && v.length < 2) {
        msg = p.label + '输入不能少于两个字!';
        break;
      }
    }
  }
  return msg;
}

export default (props) => {
  const Base = Components.Base;
  const { property, pageAxis } = Components.Base.getProps(props);
  const [properties, setProperties] = useState(null);
  const [value, setValue] = useState([]);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = (v) => getPropertiesValues(properties);
  property.judgeValueRange = () => judgeValueRange(properties);

  useEffect(() => {
    setProperties(getProperties(value, property, pageAxis));
  }, [pageAxis, value, property, setProperties])

  if (!isVisible) return null;

  if (properties === null || properties.length === 0) return null;

  property.properties = properties;

  const className = Base.getClassName(property, styles);

  if (property.isList) {
    return (
      <div className={styles.divConditionForm} style={property.style}>
        <List className={className}>
          {Base.renderProperties(property, pageAxis.id)}
        </List>
      </div>
    )
  }
  if (property.isDiv) return <div className={className} style={property.style}>{Base.renderProperties(property, pageAxis.id)}</div>
  return Base.renderProperties(property, pageAxis.id);
};