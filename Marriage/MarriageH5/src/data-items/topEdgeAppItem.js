import React from 'react';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { UID, Title, PublishedDate, Abstract, CreatedDate, Description, ActivityName } = props.data;
    const { detailPageUrl, isSpectral, primaryKey } = props.property;

    const id = primaryKey && props.data[primaryKey] ? props.data[primaryKey] : UID;
    const title = Common.remvoeHtmlTag(Title || ActivityName);

    let url = Common.addUrlParams(detailPageUrl, 'UID', id);
    url = Common.addUrlParams(url, 'title', title);
    const abstract = isSpectral ? Common.remvoeHtmlTag(Description) : Common.remvoeHtmlTag(Abstract);
    const date = isSpectral ? CreatedDate : PublishedDate;

    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <span className={styles.spanTitle}>{title}</span>
                <span className={styles.spanDate}><img src={Common.getImageUrl('calendar.png')} alt='' />{date}</span>
                {abstract && <span className={styles.spanAbstract} style={{ WebkitBoxOrient: "vertical" }}>{abstract}</span>}
            </div>
        </Link>
    );
}