import React, { useState } from 'react'
import styles from '../styles/view.css';
import Base from './base';

export default (props) => {
    const { property } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

   property.setVisible = (v) => setIsVisible(v);

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);

    return (
        <div className={className} style={property.style}></div>
    )
}