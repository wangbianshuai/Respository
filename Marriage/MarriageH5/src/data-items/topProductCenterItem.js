import React from 'react';
import { EnvConfig } from 'Configs';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { UID, Title, CreatedDate, Image,Abstract } = props.data;
    const { detailPageUrl } = props.property;
    let url = Common.addUrlParams(detailPageUrl, 'UID', UID);
    url = Common.addUrlParams(url, 'title', Title);
    const src = EnvConfig.getServiceUrl('ImageService')() + 'LibraryImages/' + Image;

    const abstract = Common.remvoeHtmlTag(Abstract)

    if (Image) {
        return (
            <Link to={url}>
                <div className={styles.divItem}>
                    <div className={styles.divLeft}><img src={src} alt='' /></div>
                    <div className={styles.divRight}>
                        <span className={styles.spanTitle}>{Title}</span>
                        <span className={styles.spanAbstract} style={{ WebkitBoxOrient: "vertical" }}>{abstract}</span>
                    </div>
                </div>
            </Link>
        );
    }
    else{
        return (
            <Link to={url}>
                <div className={styles.divItem2}>
                    <span className={styles.spanTitle2}>{Title}</span>
                    <span className={styles.spanDate2}><img src={Common.getImageUrl('calendar.png')} alt='' />{CreatedDate}</span>
                    <span className={styles.spanAbstract} style={{ WebkitBoxOrient: "vertical" }}>{abstract}</span>
                </div>
            </Link>
        );
    }
}