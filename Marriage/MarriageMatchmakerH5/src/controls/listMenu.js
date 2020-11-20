import React, { useCallback, useState } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import { List } from 'antd-mobile';
import Base from './base';
import styles from '../styles/view.scss';

const renderItem = (property, data, i, value, onClick) => {
  const { valueName, textName } = property;
  const text = data[textName];
  value = value || data[valueName];
  if (property.isShowValue === false) value = undefined;

  if (!data.arrow && property.isRightArraw) data.arrow = 'horizontal';
  if (!data.url && property.url) data.url = Common.replaceDataContent(data, property.url, true);

  const thumb = data.thumb ? Common.getImageUrl(data.thumb) : undefined;

  return <List.Item arrow={data.arrow} thumb={thumb} key={i} extra={value} onClick={() => onClick(data)}>
    {text}
  </List.Item>;
};

const renderOptions = (options, property, value, onClick) => {
  return options.map((m, i) => renderItem(property, m, i, value, onClick));
}

const getOptions = (property, view, pageAxis, parentValue) => {
  const options = [];

  Base.setValueTextName(property);

  const { dataSource } = property;

  Common.isArray(dataSource) && dataSource.forEach((d, i) => {
    options.push(d)
  });

  return options;
};

export default (props) => {
  const { property, view, pageAxis } = Base.getProps(props);

  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState(property.value);

  const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

  const onClick = useCallback((data) => {
    if (data.url) pageAxis.toPage(data.url)
  }, [pageAxis]);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));

  if (!isVisible || options.length === 0 || (Common.isNullOrEmpty(value) && property.isHasValueVisible)) return null;

  const className = Base.getClassName(property, styles);

  return <List className={className}> {renderOptions(options, property, value, onClick)}</List>
}