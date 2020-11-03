import React, { useState, useEffect } from 'react';
import { List } from 'antd-mobile';
import styles from '../styles/view.scss';
import Base from './base';

export default (props) => {
    const { property, view, pageId, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    useEffect(() => {
        Base.load(property, view, pageAxis);
    }, [property, view, pageAxis]);

    property.setVisible = (v) => setIsVisible(v);
    property.reLoad = () => Base.load(property, view, pageAxis);

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);


    if (property.isList) {
        return (
            <List className={className} style={property.style}>
                {Base.renderProperties(property, pageId)}
            </List>
        )
    }

    if (property.isDiv) return <div className={className} style={property.style}>{Base.renderProperties(property, pageId)}</div>
    return Base.renderProperties(property, pageId);
}