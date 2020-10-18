import React, { useState, useEffect } from 'react';
import Controls from 'Controls';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const setCollectText = (pageAxis, isCollect) => {
    let text = '收藏';
    if (isCollect) text = '取消' + text;
    pageAxis.props.location.pageData.setCollectText && pageAxis.props.location.pageData.setCollectText(text);
};

const checkIsExistFavorites = (pageAxis, property, setIsVisible) => {
    if (!pageAxis.token) {
        setCollectText(pageAxis, false);
        return;
    }

    const payload = {
        formData: {
            Param: JSON.stringify({ ArticleType: property.articleType, ArticleUID: pageAxis.pageData.UID }),
            Act: 'Favorites_CheckIsExist'
        }
    }
    pageAxis.dispatchAction('UserService', 'checkIsExistFavorites', payload).then(res => {
        const isCollect = pageAxis.isSuccessProps(res);
        if (isCollect) setIsVisible(true);
        setCollectText(pageAxis, isCollect)
    });
};

export default (props) => {
    const { property, pageAxis } = Controls.Base.getProps(props);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        checkIsExistFavorites(pageAxis, property, setIsVisible);
    }, [pageAxis, property, setIsVisible]);

    property.refresh = (isCollect) => {
        setIsVisible(isCollect);
        setCollectText(pageAxis, isCollect)
    };

    if (!isVisible) return null;

    const { style } = property;

    const className = Controls.Base.getClassName(property, styles, 'divStar');

    return (<div className={className} style={style}><img src={Common.getImageUrl('star.png')} alt='' /></div>)
};