import React from 'react';
import { EnvConfig } from 'Configs';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { UID, VideoName, Image } = props.data;
    const { detailPageUrl, primaryKey } = props.property;

    const id = primaryKey && props.data[primaryKey] ? props.data[primaryKey] : UID;

    let url = Common.addUrlParams(detailPageUrl, 'UID', id);
    url = Common.addUrlParams(url, 'title', VideoName);
    const src = EnvConfig.getServiceUrl('ImageService')() + 'VideosImages/' + Image;

    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <div className={styles.divImage} style={{ background: `url(${src}) no-repeat`, backgroundSize: '10rem 6.75rem' }}><img src={Common.getImageUrl('play.png')} alt='' /></div>
                <div className={styles.divText}>
                    <span style={{ WebkitBoxOrient: "vertical" }}>{VideoName}</span>
                </div>
            </div>
        </Link>
    );
}