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
    pageAxis.updateRoseCount = (isSend) => {
        if (isSend) data.RoseCount += 1;
        else data.RoseCount = 0;

        setData({ ...data });
    };

    let detailUrl = property.detailUrl;
    detailUrl = Common.replaceDataContent(pageAxis.pageData, detailUrl, true);

    const { HeadImgUrl, Remark, NickName, RoseCount, RoseCount2, Age } = data || {}

    const roseImg = property.isSquare ? Common.getImageUrl('rose.png') : undefined;
    const roseImg2 = property.isSquare ? Common.getImageUrl('rose.png') : undefined;

    const renderInfo = () => {
        return <div className={styles.divTopUserInfo}>
            <div className={styles.divLeft}>{HeadImgUrl && <img src={HeadImgUrl} alt='' />}</div>
            <div className={styles.divRight}>
                <div className={styles.divTop}>
                    <span>{NickName}</span>
                    {Age && <label>{Age}岁</label>}
                    {roseImg && <div className={styles.divRose}><img src={roseImg} alt='' /><span>{RoseCount}</span></div>}
                    {roseImg2 && <div className={styles.divRose}><img src={roseImg2} alt='' /><span>{RoseCount2}</span></div>}
                </div>
                <div className={styles.divBottom}>
                    <span>{Remark}</span>
                    {detailUrl && <Icon type='right' style={{ color: '#999' }} />}
                </div>
            </div>
        </div>
    }

    return (<div className={styles.divUserInfo}>
        {detailUrl ? <Link to={detailUrl}>{renderInfo()}</Link> : renderInfo()}
    </div>)
};