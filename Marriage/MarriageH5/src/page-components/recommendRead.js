import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import { router } from "dva";
import Components from 'Components';
import styles from '../styles/view.scss';

const { Link } = router;

const renderItem = (property, data, i, pageAxis) => {
  const { primaryKey, textName, detailPageUrl } = property;
  let url = Common.addUrlParams(detailPageUrl, primaryKey, data[primaryKey]);
  url = Common.addUrlParams(url, 'tabPage', pageAxis.pageData.tabPage);
  url = Common.addUrlParams(url, 'title', data[textName]);
  return (
    <li className={styles.divItem} key={i}>
      <Link to={url} ><div className={styles.divText}><span>{data[textName]}</span></div></Link>
    </li>)
};

const getOptions = (property, view, pageAxis, parentValue) => {
  const options = [];

  const { dataSource } = property;

  Common.isArray(dataSource) && dataSource.forEach((d, i) => {
    options.push(renderItem(property, d, i, pageAxis))
  });

  return options;
};

export default (props) => {
  const { Base } = Components;
  const { property, view, pageAxis } = Base.getProps(props);

  const [isVisible, setIsVisible] = useState(property.isVisible !== false);

  const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

  property.setVisible = (v) => setIsVisible(v);
  property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));

  if (!isVisible || options.length === 0) return null;

  const className = Base.getClassName(property, styles);

  const { title } = property;

  return <div className={className}>
    <div className={styles.divTitle2}>
      <span>{title || '推荐阅读'}</span>
    </div>
    <ul className={styles.divData}>{options}</ul>
  </div>;
}