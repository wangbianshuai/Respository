import React, { useState } from 'react'
import styles from '../styles/view.css';
import base from './base';

export default (props) => {
    const { property } = base.getProps;
    const [isVisible, setIsVisible] = useState(props.property.isVisible !== false);

    if (!property.setVisible) property.setVisible = (v) => setIsVisible(v);

    if (!isVisible) return null;

    const className = base.getClassName(property, styles);

    return (
        <div className={className} style={property.style}></div>
    )
}