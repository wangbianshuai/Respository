import React from 'react';
import { Common } from 'UtilsCommon';
import { usePageAxis } from 'UseHooks';
import { Icon } from "antd";

const setVisible = (property, setIsVisible) => (v) => {
  property.isVisible = v;
  if (property.isFormItem && property.setFormItemVisible) property.setFormItemVisible(v);
  else setIsVisible(v);
};

const getClassName = (property, styles, defaultClassName) => {
  let className = property.className || defaultClassName;
  if (className && styles[className]) className = styles[className];
  return className;
}

const load = (property, view, pageAxis) => {
  if (property.eventActionName) pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
};

const getProps = (props) => {
  const { property, view, pageId } = props;
  const pageAxis = usePageAxis.getPageAxis(pageId);
  return { property, view, pageId, pageAxis };
};

const getInitValue = (property) => {
  if (property.initValue !== undefined) return property.initValue;

  let value = null;
  if (!Common.isNullOrEmpty(property.value)) value = property.value;
  else if (!Common.isNullOrEmpty(property.defaultValue)) value = property.defaultValue;

  const { isBind, data, name, propertyName } = property;
  const name2 = propertyName || name;
  if (value && isBind && data) {
    if (data[name2] === undefined) data[name2] = value;
    else if (data[name2] !== value) value = data[name2];
  }

  property.initValue = value;

  return value;
};

const getProperty = (name, view) => {
  return Common.arrayFirst(view.properties, (f) => f.name === name);
}

const judgePush = (d, parentValue, property, view) => {
  if (parentValue === undefined && view && property.parentName && property.parentPropertyName) {
    const parentProperty = getProperty(property.parentName, view);
    if (parentProperty.getValue) parentValue = parentProperty.getValue();
    else parentValue = parentProperty.value || (parentProperty.defaultValue || null);
  }
  else if (parentValue === undefined) return Common.isEquals(parentValue, d[property.parentPropertyName], true);

  return true;
};

const renderPrefix = (property) => {
  const { prefixIcon } = property
  if (prefixIcon) return <Icon type={prefixIcon.type} style={prefixIcon.style} />
  return null;
};

const bindDataValue = (property, value) => {
  const { isBind, data, name, propertyName } = property;
  const name2 = propertyName || name;
  if (isBind && data) data[name2] = value;
};


const getValueTextName = (property) => {
  const { serviceDataSource } = property;
  let valueName = 'value';
  let textName = 'text';

  if (serviceDataSource && serviceDataSource.valueName) valueName = serviceDataSource.valueName;
  else if (property.valueName) valueName = property.valueName;
  if (serviceDataSource && serviceDataSource.textName) textName = serviceDataSource.textName;
  else if (property.textName) textName = property.textName;

  return { valueName, textName };
}

export default {
  setVisible,
  getClassName,
  load,
  getProps,
  getInitValue,
  judgePush,
  getProperty,
  renderPrefix,
  bindDataValue,
  getValueTextName
}