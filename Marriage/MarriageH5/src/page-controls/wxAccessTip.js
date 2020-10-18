import React from 'react';
import Controls from 'Controls';
import styles from '../styles/activity.scss';

export default (props) => {
    const { property } = Controls.Base.getProps(props);

    const className = Controls.Base.getClassName(property, styles, 'divErrorTip');

    const src = require('../assets/iconfont-chucuo.png')
    return (<div className={className}>
        <img src={src} alt=""/>
        <span>该应用只支持微信浏览器打开...</span>
    </div>)
};