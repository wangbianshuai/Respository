import React, { useState, useCallback } from "react"
import Base from './base';
import styles from '../styles/view.scss';
import { Common } from 'UtilsCommon';

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [isVisible, setIsVisible] = useState(property.isVisible !== false && property.isDataRight !== false);
    const [disabled, setDisabled] = useState(!!property.disabled);

    const clickAction = useCallback(() => {
        if (disabled) return;
        pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis, disabled]);

    property.setVisible = (v) => setIsVisible(v);
    property.setDisabled = (v) => setDisabled(v);

    if (!isVisible) return null;

    const { style, imageName, } = property;

    const className = Base.getClassName(property, styles);

    const src = Common.getImageUrl(imageName)

    return <div className={className} onClick={clickAction} style={style}><img src={src} alt='' /></div>
};
