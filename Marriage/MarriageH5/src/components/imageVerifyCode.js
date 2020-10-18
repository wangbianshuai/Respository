import React, { useState, useCallback, useEffect } from "react"
import { Common } from "UtilsCommon";
import { EnvConfig } from 'Configs';
import Controls from "Controls";
import Base from './base';
import styles from '../styles/view.scss';

export default (props) => {
    const { property, view, pageId, pageAxis } = Base.getProps(props);
    const [verifyUrl, setVerifyUrl] = useState('');
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [randomUID, setRandonUID] = useState(null);

    const refreshVerifyUrl = useCallback(() => {
        const imageUrl = property.imageUrl;

        let url = "";
        if (imageUrl) url = Common.addUrlRandom(imageUrl);
        else {
            url = EnvConfig.getServiceUrl('ImageService')()
            url = `${url}zzl/validlyCodeImg.aspx?UID=${randomUID}`;
            url = Common.addUrlRandom(url);
        }

        setVerifyUrl(url);
    }, [property, setVerifyUrl, randomUID]);

    useEffect(() => {
        refreshVerifyUrl();
        pageAxis.dispatchAction('UserService', 'getRandomUID', {
            formData: {
                Param: '{}',
                Act: 'Common_GetRandomUID'
            }
        }).then(res => {
            if (pageAxis.isSuccessProps(res)) setRandonUID(res.RandomUID)
        });
    }, [setRandonUID, pageAxis]);

    useEffect(() => {
        if (randomUID) refreshVerifyUrl()
    }, [refreshVerifyUrl, randomUID]);

    property.setItemVisible = (v) => setIsVisible(v);
    property.refreshVerifyUrl = () => refreshVerifyUrl();
    property.getValue2 = () => randomUID;

    if (!isVisible) return null;

    return (
        <div className={styles.divImageVerify}>
            <Controls.TextBox property={property} View={view} pageId={pageId} />
            <img src={verifyUrl} onClick={refreshVerifyUrl} alt='' />
        </div>
    )
};