import React from 'react';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { CreatedDate, Title, Status, UID } = props.data;
    let statusName = '审核中';
    if (Status === 10) statusName = '审核不通过';
    else if (Status === 100) statusName = '审核通过';

    let primaryKey = 'PointRequireUID';
    let detailPageUrl = '/integral/getEdit';
    if (props.property.detailPageUrl) {
        detailPageUrl = props.property.detailPageUrl;
        primaryKey = props.property.primaryKey;
    }

    let url = Common.addUrlParams(detailPageUrl, primaryKey, UID);
    url = Common.addUrlParams(url, 'Status', Status);
    url = Common.addUrlParams(url, 'title', Title);

    return (
        <Link to={url}>
            <div className={styles.divGetDataRow}>
                <span>{CreatedDate}</span>
                <span>{Title}</span>
                <span>{statusName}</span>
            </div>
        </Link>
    );
}