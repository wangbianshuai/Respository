import React from 'react';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { UID, BillID, Status, CreatedDate } = props.data;
    const { detailPageUrl } = props.property;

    const title = `订单号：${BillID}`

    let statusName = '审核中';
    if (Status === 10) statusName = '审核不通过';
    else if (Status === 100) statusName = '审核通过';

    let url = Common.addUrlParams(detailPageUrl, 'UID', UID);
    url = Common.addUrlParams(url, 'title', title);;

    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <span className={styles.spanTitle}>{title}</span>
                <span className={styles.spanType}><img src={Common.getImageUrl('videotype.png')} alt='' />{statusName}</span>
                <span className={styles.spanDate}><img src={Common.getImageUrl('calendar.png')} alt='' />{CreatedDate}</span>
            </div>
        </Link>
    );
}