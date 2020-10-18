import React, { useState, useCallback } from 'react';
import Controls from 'Controls';
import { Button } from 'antd-mobile';
import styles from '../styles/view.scss';

export default (props) => {
    const { property, view, pageAxis } = Controls.Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Controls.Base.getInitValue(property));

    const onClick = useCallback(() => {
        pageAxis.judgeLogin();
    }, [pageAxis]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);

    if (!isVisible && !value) return null;

    const { style, allowFullScreen } = property;

    const className = Controls.Base.getClassName(property, styles);

    if (view.entityData && !view.entityData.WhoCanRead) {
        return (<iframe className={className} frameBorder="0" style={style} allowFullScreen={allowFullScreen} src={value} />)
    }

    if (!pageAxis.token) {
        return (<div className={styles.divLeftButton} style={style}><Button size='small' type='ghost' onClick={onClick}>Login to watch the video</Button></div>)
    }
    else if (view.entityData && view.entityData.WhoCanRead <= pageAxis.loginUser.UserType) {

        return (<iframe className={className}  frameBorder="0" style={style} allowFullScreen={allowFullScreen} src={value} />)
    }
    else return null;
};