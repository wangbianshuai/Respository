import React from 'react';
import { Link } from 'Configs';
import { Common } from 'UtilsCommon';
import styles from '../styles/accountBillItem.scss';

export default React.memo((props) => {
    const { property, data } = props;
    const { detailPageUrl } = property;
    const { Remark, ItemId, CreateDate, Name } = data;

    let url = Common.addUrlParams(detailPageUrl, 'ItemId', ItemId);
    url = Common.addUrlParams(url, 'navTitle', '修改实体项目');

    return (<div className={styles.divContainer}>
        <Link to={url}>
            <div className={styles.divText1}>
                <span>{Name}</span>
                <span>{CreateDate}</span>
            </div>
            <div className={styles.divText3}>{Remark}</div>
        </Link>
    </div >)
});