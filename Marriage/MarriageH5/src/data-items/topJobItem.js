import React from 'react';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { UID, JobName, Address, VAddCnName, VAddPCnName, VAddCCnName, CreatedDate, ExpirationDate } = props.data;
    const { detailPageUrl } = props.property;
    let url = Common.addUrlParams(detailPageUrl, 'UID', UID);
    url = Common.addUrlParams(url, 'title', JobName);

    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <div className={styles.divName}>{JobName}</div>
                <div className={styles.divText}>公司/院校: {Address}</div>
                <div className={styles.divText}>城市: {VAddCnName}-{VAddPCnName}-{VAddCCnName}</div>
                <div className={styles.divText}>发布日期: {CreatedDate}</div>
                <div className={styles.divText}>信息有效期: {ExpirationDate}</div>
            </div>
        </Link>
    );
}