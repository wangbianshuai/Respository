import React, { useState } from 'react';
import Base from './base';
import styles from '../styles/view.scss';

export default (props) => {
    const { property } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Base.getInitValue(property));

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);

    if (!isVisible || !value) return null;

    const { style, allowFullScreen } = property;

    const className = Base.getClassName(property, styles);

    return (<iframe className={className} frameBorder="0" style={style} allowFullScreen={allowFullScreen} src={value} />)
};