import React from 'react';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { UID, JobName, CreatedDate } = props.data;
    const { detailPageUrl } = props.property;

    let url = Common.addUrlParams(detailPageUrl, 'JobUID', UID);
    url = Common.addUrlParams(url, 'title', JobName);
    
    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <span className={styles.spanTitle}>{JobName}</span>
                <span className={styles.spanDate}><img src={Common.getImageUrl('calendar.png')} alt='' />{CreatedDate}</span>
            </div>
        </Link>
    );
}