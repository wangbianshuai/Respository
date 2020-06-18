import React, { useState, useEffect } from 'react'
import { Common } from 'UtilsCommon';
import { Card } from 'antd';
import styles from '../styles/view.css';
import base from './base';

export default (props) => {
    const { property, view, pageId, pageAxis } = base.getProps;
    const [isVisible, setIsVisible] = useState(props.property.isVisible !== false);

    useEffect(() => {
        base.load(property, view, pageAxis);
    }, [property, view, pageAxis]);

    if (!property.setVisible) property.setVisible = (v) => setIsVisible(v);
    if (!property.reLoad) property.reLoad = () => base.load(property, view, pageAxis);

    if (!isVisible) return null;

    if (property.title) {
        return (
            <Card title={Common.replaceDataContent(pageAxis.pageData, property.title)} style={property.style} bordered={false}
                headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                {base.renderProperties(property, pageId)}
            </Card>
        )
    }

    const className = base.getClassName(property, styles);

    if (property.isDiv) return <div className={className} style={property.style}>{base.renderProperties(property, pageId)}</div>
    return base.renderProperties(property, pageId);
}