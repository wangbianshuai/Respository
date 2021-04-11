import React, { useCallback } from 'react';
import { Common } from 'UtilsCommon';
import { List } from 'antd-mobile';
import { EnvConfig } from 'Configs';
import Controls from 'Controls';
import styles from '../styles/view.scss';

export default (props) => {
    const { property, pageAxis } = Controls.Base.getProps(props);

    const onClick = useCallback(() => {
        Common.removeCookie('token');
        Common.removeStorage(EnvConfig.tokenKey);
        pageAxis.toLogin();
    }, [pageAxis]);

    const className = Controls.Base.getClassName(property, styles);

    return <List className={className}>
        <List.Item onClick={onClick}>退出</List.Item>
    </List>
}