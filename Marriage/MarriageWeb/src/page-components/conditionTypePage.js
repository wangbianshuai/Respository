import React, { useState } from 'react';
import Components from 'Components';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.css';

const renderText = (value, i, dataSource) => {
  const item = Common.arrayFirst(dataSource, f => Common.isEquals(f.Value, value, true))
  if (item === null) return <label key={i}>{value}</label>
  return <label key={i}>{item.Name}</label>
};

const getIntervalText = (item) => {
  if (Common.isNullOrEmpty(item.Value)) return '';
  const vs = item.Value.split(',');
  let leftValue = vs[0];
  let rightValue = vs.length > 1 ? vs[1] : '';
  return <React.Fragment><label>{leftValue}</label><span className={styles.spZhi}>至</span><label>{rightValue}</label></React.Fragment>;
};

const getDataSourceSelectValue = (item) => {
  if (Common.isNullOrEmpty(item.Value)) return '';

  const valueList = item.Value.indexOf('[') === 0 ? JSON.parse(item.Value) : [item.Value];

  return valueList.map((m, i) => renderText(m, i, item.DataSource));
}

const getSelectValue = (item) => {
  if (item.DataSource) return getDataSourceSelectValue(item);
  else if (item.IsInterval === 1) return getIntervalText(item);
  else if (item.SelectType === 2 && item.DataType === 'number') return getIntervalText(item);

  return item.Value;
};

const renderCondtionTypeItem = (item) => {
  return <div className={styles.divItem2} key={item.ItemId}>
    <div className={styles.divTitle2}>
      <span>{item.Title}</span>
    </div>
    <div className={styles.divValue}>
      <span>{getSelectValue(item)}</span>
    </div>
  </div>
};

const renderItem = (data) => {
  return <div className={styles.divItem} key={data.UserConditionTypeId}>
    <div className={styles.divTitle}>
      <span>{data.ConditionTypeName}</span>
    </div>
    {data.Items && <div className={styles.divData}>
      {data.Items.map(m => renderCondtionTypeItem(m))}
    </div>}
  </div>
}

export default (props) => {
  const { property } = Components.Base.getProps(props);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState([]);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => value;

  if (!isVisible) return null;

  return (<div className={styles.divUserConditionType}>
    {value.map(m => renderItem(m))}
    {value.length === 0 && <span>{property.selectType === 1 ? '暂无填写条件信息' : '暂无填写择偶标准'}</span>}
  </div>)
};