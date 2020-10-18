import React from 'react';
import { EnvConfig } from 'Configs';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { UID, NewsImage01, NewsTitle, NewsAbstract, NewsDate, ActivityName, StartDate, Image, Contents } = props.data;
    const { detailPageUrl, isSpectral, primaryKey } = props.property;

    const title = isSpectral ? ActivityName : NewsTitle;
    const id = primaryKey && props.data[primaryKey] ? props.data[primaryKey] : UID;

    let url = Common.addUrlParams(detailPageUrl, 'UID', id);
    url = Common.addUrlParams(url, 'title', title);

    let src = EnvConfig.getServiceUrl('ImageService')() + 'NewsImages/' + NewsImage01;
    let abstract = Common.remvoeHtmlTag(NewsAbstract);

    const date = isSpectral ? StartDate : NewsDate;

    if (isSpectral) {
        src = EnvConfig.getServiceUrl('ImageService')() + 'ActivitiesImages/' + Image;
        abstract = Common.remvoeHtmlTag(Contents);
    }

    abstract='';

    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <div className={styles.divLeft}><img src={src} alt='' /></div>
                <div className={styles.divRight}>
                    <span className={styles.spanTitle} style={{ WebkitBoxOrient: "vertical" }}>{title}</span>
                    {date && <span className={styles.spanDate}><img src={Common.getImageUrl('calendar.png')} alt='' />{date}</span>}
                    {abstract && <span className={styles.spanAbstract} style={{ WebkitBoxOrient: "vertical" }}>{abstract}</span>}
                </div>
            </div>
        </Link>
    );
}