import React, { useState } from 'react';
import { List } from 'antd-mobile';
import Controls from 'Controls';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

export default (props) => {
  const { property } = Controls.Base.getProps(props);
  const [data, setData] = useState({});

  property.setValue = (d) => setData(d);

  const { Status, NoPassReason } = data || {}

  if (Status === 1 || Status === undefined) return null;

  const statusName = Status === 0 ? '待审核' : Status === 2 ? '审核不通过' : '未知';

  const className = Controls.Base.getClassName(property, styles);

  const thumb = Common.getImageUrl('status.png');

  return <List className={className}>
    <List.Item extra={statusName} thumb={thumb} multipleLine={!NoPassReason}>状态
{NoPassReason && <List.Item.Brief>{NoPassReason}</List.Item.Brief>}
    </List.Item>
  </List>
}