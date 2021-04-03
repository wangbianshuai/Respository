import React from 'react';
import { Common } from 'UtilsCommon';
import { usePageAxis } from 'UseHooks';
import { Icon } from "antd-mobile";

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
  if (!property.id) property.id = Common.createGuid();
  if (property.isNullable === undefined) property.isNullable = true;
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

const getValue = (property, value) => {
  if (value === undefined) return null
  if (property.dataType === 'bool') return value.toString() === "true" || parseInt(value, 10) === 1;
  if (typeof value === "string") return Common.trim(value);
  if (Common.isArray(value) && property.isString) return value.join(",");
  if (Common.isArray(value) && property.isJson) {
    if (value.length === 0) return '';
    return JSON.stringify(value);
  }
  return value;
};

const bindDataValue = (property, value) => {
  const { isBind, data, name, propertyName } = property;
  const name2 = propertyName || name;
  if (isBind && data) data[name2] = getValue(property, value);
};

const setValueTextName = (property) => {
  if (property.valueName && property.textName) return;

  const { serviceDataSource } = property;
  let valueName = 'value';
  let textName = 'text';

  if (serviceDataSource && serviceDataSource.valueName) valueName = serviceDataSource.valueName;
  if (serviceDataSource && serviceDataSource.textName) textName = serviceDataSource.textName;

  property.valueName = valueName;
  property.textName = textName;
}

const setDefaultValue = (property) => {
  if (property.isCurrentDay) property.defaultValue = Common.getCurrentDate().substr(0, 10);

  if (property.isMonthFirst) property.defaultValue = Common.getCurrentDate().substr(0, 8) + "01";
};

const getSelectData = (property, value) => {
  if (value === undefined) value = getValue(property, value)
  return Common.arrayFirst(property.dataSource, (f) => Common.isEquals(f[property.valueName], value, true));
};

const setPropertyValue = (name, data, view) => {
  const p = getProperty(name, view);
  if (!p) return;

  name = p.propertyName || p.name;
  var v = data[name]

  if (p.setValue) p.setValue(v);
  else p.value = v;

  if (p.propertyName2) {
    v = data[p.propertyName2];
    if (p.setValue2) p.setValue2(v);
    else p.value2 = v;
  }
};

const setSelectDataToProperties = (property, view, data) => {
  data = data || {};

  property.selectDataToProperties.forEach(p => setPropertyValue(p, data, view));
};

const setPropertiesVisible = (view, names, visiblePropertyNames, isVisible) => {
  names.forEach(n => {
    if (!isVisible && visiblePropertyNames.includes(n)) return;
    const p = getProperty(n, view);
    p.isVisible = isVisible;
    if (p && p.setItemVisible) p.setItemVisible(isVisible);
    else if (p && p.setVisible) p.setVisible(isVisible);
  });
};

const setValueVisibleProperties = (property, view, value) => {
  if (Common.isNullOrEmpty(value)) return;

  const { valueVisibleProperties } = property;

  const visiblePropertyNames = valueVisibleProperties[value] || [];

  for (let key in valueVisibleProperties) {
    setPropertiesVisible(view, valueVisibleProperties[key], visiblePropertyNames, Common.isEquals(key, value))
  }
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
  setValueTextName,
  setDefaultValue,
  getValue,
  getSelectData,
  setSelectDataToProperties,
  setPropertyValue,
  setPropertiesVisible,
  setValueVisibleProperties
}