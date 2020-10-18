import React, { useState } from 'react';
import Base from './base';
import styles from '../styles/view.scss';

export default (props) => {
    const { property } = props;

    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    property.setVisible  = (v) => setIsVisible(v);

    if (!isVisible) return null;

    const { menus } = property;

    const className = Base.getClassName(property, styles);

    return <div className={className}>{menus.map((m, i) => Base.getImageLink(m, i))}</div>;
}