import React from 'react';
import { router } from "dva";
import { Icon } from 'antd-mobile'
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { ManHeadImgUrl, ManUserName, ManAge, WomanUserName, WomanHeadImgUrl, WomanAge, MarriageDate, MarriageAddress, MarriageArrangeId } = props.data;
    const { detailPageUrl } = props.property;

    let url = Common.addUrlParams(detailPageUrl, 'marriageArrangeId', MarriageArrangeId);
    url = Common.addUrlParams(url, 'title', '连理缘-相亲安排-' + ManUserName + '-' + WomanUserName);

    const dateImg = Common.getImageUrl('date.png');
    const locationImg = Common.getImageUrl('location.png');

    return (<div className={styles.divMarriageArrangeItem}>
        <Link to={url}>
            <div className={styles.divTop}>
                <div className={styles.divUser}>
                    <img src={ManHeadImgUrl} alt='' />
                    <span>{ManUserName}</span>
                    <label>{ManAge}岁</label>
                </div>
                <div className={styles.divUser}>
                    <img src={WomanHeadImgUrl} alt='' />
                    <span>{WomanUserName}</span>
                    <label>{WomanAge}岁</label>
                </div>
            </div>
            <div className={styles.divBottom}>
                <div className={styles.divLeft}>
                    <div className={styles.divDateLocation}>
                        <img src={dateImg} alt='' /> <span>{MarriageDate}</span>
                    </div>
                    {MarriageAddress && <div className={styles.divDateLocation}>
                        <img src={locationImg} alt='' /> <span>{MarriageAddress}</span>
                    </div>}
                </div>
                <div className="divRight"><Icon type='right' style={{ color: '#999' }} /></div>
            </div>
        </Link>
    </div>)
};