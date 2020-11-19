import React, { useCallback } from 'react';
import { Common } from 'UtilsCommon';
import { List } from 'antd-mobile';
import { EnvConfig } from 'Configs';
import Controls from 'Controls';
import styles from '../styles/view.scss';

const isH5 = Common.isH5();

export default (props) => {
  const { property, pageAxis } = Controls.Base.getProps(props);

  const onClick = useCallback(() => {
    Common.removeStorage(EnvConfig.wxUserKey);
    Common.removeStorage(EnvConfig.tokenKey);
    pageAxis.toPage('/');
  }, [pageAxis]);

  if (isH5) return null;

  const className = Controls.Base.getClassName(property, styles);

  return <List className={className}>
    <List.Item onClick={onClick}>退出</List.Item>
  </List>
}