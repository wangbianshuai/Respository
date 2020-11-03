import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import Base from './base';
import { List } from 'antd-mobile';
import styles from '../styles/view.scss';

const getText = (property, value) => {
  if (property.dataSource) {
    const data = Common.arrayFirst(property.dataSource, f => Common.isEquals(f.value, value));
    if (data !== null) return data.text;
  }
  return value;
}

export default (props) => {
  const { property, pageAxis } = Base.getProps(props);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState(Base.getInitValue(property));

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);

  if (!isVisible) return null;

  const { text, label, style, isDiv, isListItem, isBottomLine } = property;
  let text2 = value || text;

  text2 = Common.replaceDataContent(pageAxis.pageData, text);

  if (!Common.isNullOrEmpty(value)) text2 = getText(property, value);

  const className = Base.getClassName(property, styles);

  if (label) text2 = label + (Common.isNullOrEmpty(text2) ? '' : text2);

  if (isDiv) return (<div className={className} style={style}><span>{text2}</span>{isBottomLine && <div className={styles.divBottomLine}></div>}</div>)
  if (isListItem) return (<List.Item className={className} style={style}><span>{text2}</span></List.Item>)

  return (<span className={className} style={style}>{text2}</span>)
};