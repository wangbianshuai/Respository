import React from 'react';
import { Link } from 'Configs';
import { Common } from 'UtilsCommon';
import styles from '../styles/accountBillItem.scss';

export default React.memo((props) => {
    const { property, data } = props;
    const { detailPageUrl } = property;
    const { Remark, CategoryId, CreateDate, AccountItemName, Name } = data;

    let url = Common.addUrlParams(detailPageUrl, 'CategoryId', CategoryId);
    url = Common.addUrlParams(url, 'navTitle', '修改类别');

    return (<div className={styles.divContainer}>
        <Link to={url}>
            <div className={styles.divText1}>
                <span>{Name}</span>
            </div>
            <div className={styles.divText2}>
                <span>{AccountItemName}</span>
                <span>{CreateDate}</span>
            </div>
            <div className={styles.divText3}>{Remark}</div>
        </Link>
    </div >)
});