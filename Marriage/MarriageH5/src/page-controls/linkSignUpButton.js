import React, { useState, useCallback } from 'react';
import Controls from 'Controls';
import { Button } from 'antd-mobile';
import styles from '../styles/view.scss';

export default (props) => {
    const { property, pageAxis } = Controls.Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Controls.Base.getInitValue(property));

    const onClick = useCallback(() => {
        if (!pageAxis.judgeLogin()) return;
        window.open(value);
    }, [value])

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);

    if (!isVisible || (pageAxis.token && !value)) return null;

    return (<div className={styles.divDetailBottom}><Button size='small' type='primary' className={styles.button} onClick={onClick}>报名</Button></div>)
};