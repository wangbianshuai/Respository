import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { Common } from 'UtilsCommon';
import base from './base';
import styles from '../styles/view.css';

export default (props) => {
    const { property, view, pageId, pageAxis } = base.getProps(props);
    const [isVisible, setIsVisible] = useState(props.property.isVisible !== false);

    if (!property.setVisible) property.setVisible = (v) => setIsVisible(v);
    if (!property.reLoad) property.reLoad = () => base.load(property, view, pageAxis);

    useEffect(() => {
        base.initSetView(property);
        base.load(property, view, pageAxis);
    }, [property, view, pageAxis]);

    if (!isVisible) return null;

    if (property.title) {
        return (
            <Card title={Common.replaceDataContent(pageAxis.pageData, property.title)} style={property.style}
                bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                {base.renderFormView(property, pageId)}
            </Card>
        )
    }

    if (property.isDiv === false) return base.renderFormView(property, pageId);

    const className = base.getClassName(property, styles, 'divView');

    return (
        <div className={className} style={property.style}>
            {base.renderFormView(property, pageId)}
        </div>
    )
}