import React, { useCallback, useState } from 'react'
import { Icon, NavBar } from 'antd-mobile';
import styles from '../styles/view.scss';
import Base from './base';

export default (props) => {
    const { property, pageId, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    property.setVisible = (v) => setIsVisible(v);

    const onBack = useCallback(() => { pageAxis.toBack() }, [pageAxis])

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);

    const { mode } = property;

    const text = pageAxis.pageData.navTitle || property.text;

    const icon = property.isBack ? <Icon type='left' onClick={onBack} size='lg' color='#ffffff' /> : null;

    const renderContent = property.rightProperty ? Base.getPropertyItem(property.rightProperty, property, pageId) : null;
    const leftContent = property.leftProperty ? Base.getPropertyItem(property.leftProperty, property, pageId) : null;

    return <NavBar className={className} icon={icon} leftContent={leftContent} rightContent={renderContent} style={property.style} mode={mode}>{text}</NavBar>
}