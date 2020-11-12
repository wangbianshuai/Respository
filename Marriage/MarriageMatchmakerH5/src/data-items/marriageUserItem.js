import React from 'react';
import { router } from "dva";
import { Icon } from 'antd-mobile'
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
  const { HeadImgUrl, Phone, NickName, Sex, Age, UserId } = props.data;
  const { detailPageUrl } = props.property;

  const sexImg = Sex > 0 ? Common.getImageUrl(Sex === 1 ? 'man.png' : 'woman.png') : undefined;

  let url = Common.addUrlParams(detailPageUrl, 'UserId', UserId);
  let = Common.addUrlParams(detailPageUrl, 'title', '连理缘-' + NickName);

  return (<div className={styles.divUserInfo}>
    <Link to={url}>
      <div className={styles.divTopUserInfo}>
        <div className={styles.divLeft}>{HeadImgUrl && <img src={HeadImgUrl} alt='' />}</div>
        <div className={styles.divRight}>
          <div className={styles.divTop}>
            <span>{NickName}</span>
            {sexImg && <img src={sexImg} alt='' />}
            <label>{Age}岁</label>
          </div>
          <div className={styles.divBottom}>
            <span>手机号码：{Phone}</span>
            <Icon type='right' style={{ color: '#999' }} />
          </div>
        </div>
      </div>
    </Link>
  </div>)
};