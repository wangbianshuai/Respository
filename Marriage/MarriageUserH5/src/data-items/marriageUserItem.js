import React from 'react';
import { router } from "dva";
import { Icon } from 'antd-mobile'
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
  const { HeadImgUrl, Remark, NickName, Age, UserId } = props.data;
  const { detailPageUrl } = props.property;

  let url = Common.addUrlParams(detailPageUrl, 'userId', UserId);
  url = Common.addUrlParams(url, 'title', '连理缘-' + NickName);

  return (<div className={styles.divUserInfo}>
    <Link to={url}>
      <div className={styles.divTopUserInfo}>
        <div className={styles.divLeft}>{HeadImgUrl && <img src={HeadImgUrl} alt='' />}</div>
        <div className={styles.divRight}>
          <div className={styles.divTop}>
            <span>{NickName}</span>
            <label>{Age}岁</label>
          </div>
          <div className={styles.divBottom}>
            <span>{Remark}</span>
            <Icon type='right' style={{ color: '#999' }} />
          </div>
        </div>
      </div>
    </Link>
  </div>)
};