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
  if (view && property.parentName && property.parentPropertyName) {
    const key = 'parent_' + property.parentName;
    if (!property[key]) property[key] = getProperty(property.parentName, view);
    const parentProperty = property[key];

    if (parentValue === undefined) {
      if (parentProperty.getValue) parentValue = parentProperty.getValue();
      else parentValue = parentProperty.value || (parentProperty.defaultValue || null);
    }

    return Common.isEquals(parentValue, d[property.parentPropertyName], true);
  }

  return true;
};

const childPropertiesChanged = (property, view, value) => {
  if (Common.isArray(property.childNames)) {
    let p = null, key = '';
    property.childNames.forEach(n => {
      key = 'child_' + n;
      if (!property[key]) property[key] = getProperty(n, view);
      p = property[key];
      if (p != null && p.setParentValue) {
        if (property.isChanged && !Common.isNullOrEmpty(p.parentValue) && p.parentValue !== value) {
          p.setValue(null);
          p.value = null;
        }
        p.parentValue = value;
        p.setParentValue();
      }
    });
  }
};

const renderPrefix = (property) => {
  const { prefixIcon } = property
  if (prefixIcon) return <Icon type={prefixIcon.type} style={prefixIcon.style} />
  return null;
};

const getValue = (property, value) => {
  if (value === undefined) return null
  if (typeof value === "string") return Common.trim(value);
  if (Common.isArray(value) && property.isString) return value.join(",");
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
  if (property.isYesterday) property.defaultValue = Common.getYesterdayDate().substr(0, 10);

  if (property.isMonthFirst) property.defaultValue = Common.getCurrentDate().substr(0, 8) + "01";

  if (property.isCurrentUser) property.defaultValue = Common.getStorage("loginUserId");
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

const setPropertiesVisible = (names, view, isVisible) => {
  names.forEach(n => {
    const p = getProperty(n, view);
    if (p) {
      if (p.setIsVisible) p.setIsVisible(isVisible);
      if (p.setFormItemVisible) p.setFormItemVisible(isVisible);
      p.isVisible = isVisible;
    }
  });
}

const setValueVisibleProperties = (property, view, value) => {
  if (Common.isNullOrEmpty(value)) return;

  const { valueVisibleProperties } = property;

  for (let key in valueVisibleProperties) {
    setPropertiesVisible(valueVisibleProperties[key], view, Common.isEquals(key, value))
  }
};

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
  setValueVisibleProperties,
  setPropertyValue,
  childPropertiesChanged
}