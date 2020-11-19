import React, { useCallback, useState } from 'react';
import { Common } from 'UtilsCommon';
import { List } from 'antd-mobile';
import Controls from 'Controls';
import styles from '../styles/view.scss';

const renderItem = (property, value, onClick) => {
  const thumb = Common.getImageUrl('matchmaker.png');

  return <List.Item arrow='horizontal' thumb={thumb} extra={value.Name} onClick={() => onClick()}>
    {property.label}
  </List.Item>;
};

export default (props) => {
  const { property, pageAxis } = Controls.Base.getProps(props);

  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState(property.value);

  const onClick = useCallback(() => {
    const url = '/marriage/matchmaker?matchmaker=' + value.MatchmakerId;
    pageAxis.toPage(url)
  }, [pageAxis, value]);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);

  if (!isVisible || !value) return null;

  const className = Controls.Base.getClassName(property, styles);

  return <List className={className}> {renderItem(property, value, onClick)}</List>
}