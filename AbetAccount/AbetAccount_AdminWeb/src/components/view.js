import React, { useState, useEffect } from 'react'
import { Common } from 'UtilsCommon';
import { Card } from 'antd';
import styles from '../styles/view.css';
import Base from './base';

export default React.memo((props) => {
    const { property, view, pageId, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    useEffect(() => {
        Base.load(property, view, pageAxis);
    }, [property, view, pageAxis]);

    property.setVisible = (v) => setIsVisible(v);
    property.reLoad = () => Base.load(property, view, pageAxis);

    if (!isVisible) return null;

    if (property.title) {
        return (
            <Card title={Common.replaceDataContent(pageAxis.pageData, property.title)} style={property.style} bordered={false}
                headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                {Base.renderProperties(property, pageId)}
            </Card>
        )
    }

    const className = Base.getClassName(property, styles);

    if (property.isDiv) return <div className={className} style={property.style}>{Base.renderProperties(property, pageId)}</div>
    return Base.renderProperties(property, pageId);
});