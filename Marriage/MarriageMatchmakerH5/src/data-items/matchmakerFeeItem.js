import React from 'react';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

export default (props) => {
  const { ManHeadImgUrl, ManUserName, ManAge, WomanUserName, WomanHeadImgUrl, WomanAge, FeeDate, Amount } = props.data;

  const dateImg = Common.getImageUrl('date.png');
  const feeImag = Common.getImageUrl('fee.png');

  return (<div className={styles.divMarriageArrangeItem}>
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
      <div className={styles.divLeft2}>
        <div className={styles.divDateLocation}>
          <img src={dateImg} alt='' /> <span>{FeeDate}</span>
        </div>
        <div className={styles.divDateLocation}>
          <img src={feeImag} alt='' /> <span>{Amount}</span>
        </div>
      </div>
    </div>
  </div>)
};