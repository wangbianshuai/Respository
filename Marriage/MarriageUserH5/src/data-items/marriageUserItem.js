import React from 'react';
import { router } from "dva";
import { Icon } from 'antd-mobile'
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { HeadImgUrl, Remark, NickName, Age, RoseCount, RoseCount2, UserId, MarriageArrangeId } = props.data;
    const { detailPageUrl } = props.property;

    let url = Common.addUrlParams(detailPageUrl, 'userId', UserId);
    url = Common.addUrlParams(url, 'title', '连理缘-' + NickName);

    if (MarriageArrangeId) url = Common.addUrlParams(url, 'marriageArrangeId', MarriageArrangeId)

    const roseImg = RoseCount > 0 ? Common.getImageUrl('rose.png') : undefined;
    const roseImg2 = RoseCount2 > 0 ? Common.getImageUrl('rose.png') : undefined;

    return (<div className={styles.divUserInfo}>
        <Link to={url}>
            <div className={styles.divTopUserInfo}>
                <div className={styles.divLeft}>{HeadImgUrl && <img src={HeadImgUrl} alt='' />}</div>
                <div className={styles.divRight}>
                    <div className={styles.divTop}>
                        <span>{NickName}</span>
                        <label>{Age}岁</label>
                        {roseImg && <div className={styles.divRose}><img src={roseImg} alt='' /><span>{RoseCount}</span></div>}
                        {roseImg2 && <div className={styles.divRose}><img src={roseImg2} alt='' /><span>{RoseCount2}</span></div>}
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