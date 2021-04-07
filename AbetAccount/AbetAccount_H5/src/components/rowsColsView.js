import React, { useState, useMemo, useEffect } from 'react';
import { List } from 'antd-mobile'
import Base from './base';
import styles from '../styles/view.scss';

export default React.memo((props) => {
    const { property, view, pageId, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    property.setVisible = (v) => setIsVisible(v);
    property.reLoad = () => Base.load(property, view, pageAxis);

    useMemo(() => {
        Base.initSetView(property);
    }, [property]);

    useEffect(() => {
        Base.load(property, view, pageAxis);
    }, [property, view, pageAxis]);

    if (!isVisible) return null;

    if (property.isDiv === false) return Base.renderView(property, pageId);

    const className = Base.getClassName(property, styles, 'divView');

    if (property.isList) {
        return (
            <List className={className} style={property.style}>
                {Base.renderView(property, pageId)}
            </List>
        )
    }

    return (
        <div className={className} style={property.style}>
            {Base.renderView(property, pageId)}
        </div>
    )
});