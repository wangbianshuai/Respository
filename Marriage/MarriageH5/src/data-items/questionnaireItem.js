import React from 'react';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { ActivityName, StartDate, EndDate, UID } = props.data;

    const detailPageUrl = '/detail/activity?tabPage=0';

    let url = Common.addUrlParams(detailPageUrl, 'UID', UID);
    url = Common.addUrlParams(url, 'title', ActivityName);

    return (
        <Link to={url}>
            <div className={styles.divQuestionnaireDataRow}>
                <span>{ActivityName}</span>
                <span>{StartDate}</span>
                <span>{EndDate}</span>
            </div>
        </Link>
    );
}