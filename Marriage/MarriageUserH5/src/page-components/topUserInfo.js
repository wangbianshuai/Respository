import React, { useState } from 'react';
import Components from 'Components';
import styles from '../styles/view.scss';

export default (props) => {
    const { property, pageAxis } = Components.Base.getProps(props);
    const [data, setData] = useState({});

    property.setValue = (d) => setData(d);

    const { HeadImgUrl, Phone, NickName } = data || {}

    return (<div className={styles.divTopUserInfo}>
        <div className={styles.divLeft}>{HeadImgUrl && <img src={HeadImgUrl} alt='' />}</div>
        <div className={styles.divRight}>
            <div className={styles.divTop}>
                <span>{NickName}</span>
            </div>
            <div className={styles.divButtom}>
                <span>手机号码：{Phone}</span>
            </div>
        </div>
    </div>)
};