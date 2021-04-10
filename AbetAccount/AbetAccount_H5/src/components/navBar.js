import React, { useState } from 'react'
import { NavBar } from 'antd-mobile';
import styles from '../styles/view.scss';
import Base from './base';

export default (props) => {
    const { property, pageId } = props;
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    property.setVisible = (v) => setIsVisible(v);

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);

    const { mode, text } = property;

    const renderContent = property.rightProperty ? Base.getPropertyItem(property.rightProperty, property, pageId) : null;
    const leftContent = property.leftProperty ? Base.getPropertyItem(property.leftProperty, property, pageId) : null;

    return <NavBar className={className} leftContent={leftContent} rightContent={renderContent} style={property.style} mode={mode}>{text}</NavBar>
}