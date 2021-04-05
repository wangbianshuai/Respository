import React, { useState, useMemo, useEffect } from 'react';
import { Card } from 'antd';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/view.css';

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

    if (property.title) {
        return (
            <Card title={Common.replaceDataContent(pageAxis.pageData, property.title)} style={property.style}
                bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                {Base.renderFormView(property, pageId)}
            </Card>
        )
    }

    if (property.isDiv === false) return Base.renderFormView(property, pageId);

    const className = Base.getClassName(property, styles, 'divView');

    return (
        <div className={className} style={property.style}>
            {Base.renderFormView(property, pageId)}
        </div>
    )
});