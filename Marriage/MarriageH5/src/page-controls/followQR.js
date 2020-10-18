import React from 'react';
import Controls from 'Controls';
import styles from '../styles/activity.scss';
import QrCode from 'qrcode-js';

export default (props) => {
    const { property } = Controls.Base.getProps(props);

    const className = Controls.Base.getClassName(property, styles, 'divFollowQR');

    const src = QrCode.toDataURL(property.value, 4);

    return (<div className={className}>
        <div className={styles.divShade}></div>
        <div className={styles.divMain}>
            <div className={styles.divSelection}>
                <div className={styles.divCenter}>
                    <div className={styles.divTitle}><span>您还未关注公众号</span></div>
                    <div className={styles.divData}>
                        <img src={src} alt='' />
                        <p>长按识别二维码，关注官方公众号</p>
                    </div>
                </div>
            </div>
        </div>
    </div>)
};