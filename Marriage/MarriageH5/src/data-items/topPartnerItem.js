import React from 'react';
import { EnvConfig } from 'Configs';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { UID, Image, Company, Description } = props.data;
    const { detailPageUrl } = props.property;
    let url = Common.addUrlParams(detailPageUrl, 'UID', UID);
    url = Common.addUrlParams(url, 'title', Company);
    const src = EnvConfig.getServiceUrl('ImageService')() + 'CollaborationImages/' + Image;
    const abstract = Common.remvoeHtmlTag(Description)

    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <div className={styles.divLeft}><img src={src} alt='' /></div>
                <div className={styles.divRight}>
                    <span className={styles.spanTitle}>{Company}</span>
                    <span className={styles.spanAbstract} style={{ WebkitBoxOrient: "vertical" }}>{abstract}</span>
                </div>
            </div>
        </Link>
    );
}