import React, { useState, useCallback } from 'react';
import { Common } from 'UtilsCommon';
import Base from './base';
import { Icon } from 'antd-mobile';
import styles from '../styles/view.scss';

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    const rightOnClick = useCallback(() => {
        pageAxis.invokeEventAction(property.rightEventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis]);

    property.setVisible = (v) => setIsVisible(v);

    if (!isVisible) return null;

    const { text, style, rightIcon, rightIconStyle, rightImage, isRight } = property;
    let text2 = text;

    text2 = Common.replaceDataContent(pageAxis.pageData, text);

    const className = Base.getClassName(property, styles);

    return (<div className={className} style={style}>
        <span className={styles.spanLeft}></span>
        <span className={styles.spanCenter}>{text2}</span>
        <span className={styles.spanRight}>
            {rightIcon && isRight && <Icon type={rightIcon} style={rightIconStyle} onClick={rightOnClick} size='sm' />}
            {rightImage && isRight && <img src={Common.getImageUrl(rightImage)} alt='' onClick={rightOnClick} />}
        </span>
    </div>)
};