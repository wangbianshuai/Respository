import React, { useState, useEffect } from 'react';
import { List } from 'antd-mobile';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';
import Base from './base';

const isH5 = Common.isH5();

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
    
    if (pageAxis.pageConfig.id === property.id && !isH5) property.style = { minHeight: "100%", width: '480px', margin: "0 auto", boxSizing: 'border-box', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }

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