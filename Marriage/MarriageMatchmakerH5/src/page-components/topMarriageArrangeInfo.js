import React, { useState } from 'react';
import Components from 'Components';
import styles from '../styles/view.scss';
import { Icon } from 'antd-mobile'
import { router } from "dva";
import { Common } from 'UtilsCommon';

const { Link } = router;

export default (props) => {
  const { property, pageAxis } = Components.Base.getProps(props);
  const [data, setData] = useState({});

  property.setValue = (d) => setData(d);

  let detailUrl = property.detailUrl;
  detailUrl = Common.replaceDataContent(pageAxis.pageData, detailUrl, true);
  detailUrl = Common.replaceDataContent(data || {}, detailUrl, true);

  const { HeadImgUrl, Phone, NickName, Remark, Age } = data || {}

  const renderInfo = () => {
    return <div className={styles.divTopUserInfo}>
      <div className={styles.divLeft}>{HeadImgUrl && <img src={HeadImgUrl} alt='' />}</div>
      <div className={styles.divRight}>
        <div className={styles.divTop}>
          <span>{NickName}</span>
          {Age && <label className={styles.labelAge}>{Age}岁</label>}
        </div>
        <div className={styles.divBottom}>
          {Phone && <span>手机号码：{Phone}</span>}
          {!Phone && <span>{Remark}</span>}
          {detailUrl && <Icon type='right' style={{ color: '#999' }} />}
        </div>
      </div>
    </div>
  }

  return (<div className={styles.divUserInfo}>
    {detailUrl ? <Link to={detailUrl}>{renderInfo()}</Link> : renderInfo()}
  </div>)
};