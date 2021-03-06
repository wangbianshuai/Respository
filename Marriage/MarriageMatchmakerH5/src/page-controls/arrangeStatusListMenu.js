import React, { useCallback, useState } from 'react';
import { List } from 'antd-mobile';
import Controls from 'Controls';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

export default (props) => {
  const { property, pageAxis } = Controls.Base.getProps(props);
  const [data, setData] = useState({});

  const onClick = useCallback(() => {
    if (property.url) pageAxis.toPage(property.url)
  }, [pageAxis, property]);

  property.setValue = (d) => setData(d);

  const { Status, IsEdit } = data || {}

  let statusName = "待相亲";
  if (Status === 1) statusName = "有意向";
  else if (Status === 2) statusName = "无意向";
  else if (Status === 3) statusName = "牵手成功";
  else if (Status === 4) statusName = "订婚";
  else if (Status === 5) statusName = "结婚";
  else if (Status === 6) statusName = "分手";
  else if (Status === 7) statusName = "取消";

  const className = Controls.Base.getClassName(property, styles);

  const thumb = Common.getImageUrl('status.png');

  const arrow = IsEdit ? property.arrow : undefined;
  const onClick2 = IsEdit ? onClick : undefined;

  return <List className={className}>
    <List.Item extra={statusName} thumb={thumb} arrow={arrow} onClick={onClick2}>相亲状态
    </List.Item>
  </List>
}