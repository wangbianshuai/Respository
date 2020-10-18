import React, { useState, useCallback } from 'react';
import { Html2H5 } from 'UtilsCommon';
import { EnvConfig } from 'Configs'
import Controls from 'Controls';
import { Button } from 'antd-mobile';
import styles from '../styles/view.scss';

const getRepaceStrs = () => {
    const url = EnvConfig.getServiceUrl('ImageService')();
    return {
        '../HoribaUploadFiles': `${url}/HoribaUploadFiles`
    }
};

export default (props) => {
    const { property, view, pageAxis } = Controls.Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Controls.Base.getInitValue(property));

    const onClick = useCallback(() => {
        pageAxis.judgeLogin();
    }, [pageAxis]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);

    if (!isVisible || !view.entityData) return null;

    const { style } = property;

    const className = Controls.Base.getClassName(property, styles);

    if (view.entityData && !view.entityData.WhoCanRead) {
        return (<div className={className} style={style} dangerouslySetInnerHTML={{ __html: Html2H5(value, getRepaceStrs()) }} ></div>)
    }

    if (!pageAxis.token) {
        return (<div className={className} style={style}><Button size='small' type='ghost' onClick={onClick}>Login to check detail</Button></div>)
    }
    else if (view.entityData && view.entityData.WhoCanRead <= pageAxis.loginUser.UserType) {
        return (<div className={className} style={style} dangerouslySetInnerHTML={{ __html: Html2H5(value, getRepaceStrs()) }} ></div>)
    }
    else return null;
};