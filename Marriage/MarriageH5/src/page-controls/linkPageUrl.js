import React, { useState, useCallback } from 'react';
import Controls from 'Controls';
import { Button } from 'antd-mobile';
import styles from '../styles/view.scss';

export default (props) => {
    const { property } = Controls.Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Controls.Base.getInitValue(property));

    const onClick = useCallback(() => {
        window.open(value);
    }, [value])

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);

    if (!isVisible || !value || value.indexOf('http') !== 0) return null;

    const { style } = property;

    const className = Controls.Base.getClassName(property, styles);

    return (<div className={className} style={style}><Button size='small' onClick={onClick}>详情</Button></div>)
};