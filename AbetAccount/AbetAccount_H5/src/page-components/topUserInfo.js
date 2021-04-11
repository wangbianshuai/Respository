import React from 'react';
import Components from 'Components';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

export default (props) => {
    const { pageAxis } = Components.Base.getProps(props);

    const { UserName } = pageAxis.loginUser;
    const imgUrl = Common.getImageUrl('userAvatar.png');

    return (<div className={styles.divTopUserInfo}>
        <img src={imgUrl} alt='' />
        <span>{UserName}</span>
    </div>)
};