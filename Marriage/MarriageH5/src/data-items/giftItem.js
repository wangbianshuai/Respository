import React from 'react';
import { EnvConfig } from 'Configs';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { UID, GiftTitle, Image, Points } = props.data;
    const { detailPageUrl } = props.property;

    let url = Common.addUrlParams(detailPageUrl, 'UID', UID);
    url = Common.addUrlParams(url, 'title', GiftTitle);
    const src = EnvConfig.getServiceUrl('ImageService')() + 'GiftsImages/' + Image;

    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <div className={styles.divImage}><img src={src} alt='' /></div>
                <div className={styles.divText}>
                    <span>{GiftTitle}</span>
                    <span>Points:{Points}</span>
                </div>
            </div>
        </Link>
    );
}