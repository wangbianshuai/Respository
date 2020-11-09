import React, { useState } from 'react';
import Components from 'Components';
import styles from '../styles/view.scss';
import { Icon } from 'antd-mobile'
import { router } from "dva";
import { Common } from 'UtilsCommon';

const { Link } = router;

export default (props) => {
    const { property } = Components.Base.getProps(props);
    const [data, setData] = useState({});

    property.setValue = (d) => setData(d);

    const { detailUrl } = property;

    const { HeadImgUrl, Phone, NickName, Sex } = data || {}

    const sexImg = Sex > 0 ? Common.getImageUrl(Sex === 1 ? 'man.png' : 'woman.png') : undefined;

    const renderInfo = () => {
        return <div className={styles.divTopUserInfo}>
            <div className={styles.divLeft}>{HeadImgUrl && <img src={HeadImgUrl} alt='' />}</div>
            <div className={styles.divRight}>
                <div className={styles.divTop}>
                    <span>{NickName}</span>
                    {sexImg && <img src={sexImg} alt='' />}
                </div>
                <div className={styles.divBottom}>
                    <span>手机号码：{Phone}</span>
                    {detailUrl && <Icon type='right' style={{ color: '#999' }} />}
                </div>
            </div>
        </div>
    }

    return (<div className={styles.divUserInfo}>
        {detailUrl ? <Link to={detailUrl}>{renderInfo()}</Link> : renderInfo()}
    </div>)
};