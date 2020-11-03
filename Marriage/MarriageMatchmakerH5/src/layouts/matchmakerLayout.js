import React, { useMemo } from 'react';
import { Flex } from 'antd-mobile';
import Components from 'Components';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/layout.scss';

const _tabBarProperty = Base.getMatchmakerTabBarProperty(styles);

export default (props) => {
    const { history, location } = props;
    const pathName = Base.getPathName(location);
    const path = location.pathname || 'index';

    const [pageKey] = useMemo(() => {
        return [Common.createGuid()];
    }, [location]);

    return (<Flex style={{ minHeight: "100%", width: "100%" }} direction="column">
        <Flex.Item className={styles.divPage2} >
            {Base.getPageComponent(path, props, pageKey)}
        </Flex.Item>
        <Flex.Item className={styles.divTabBar} style={{ flex: 0 }}>
            <Components.TabBar property={_tabBarProperty} pathName={pathName} history={history} />
        </Flex.Item>
    </Flex>)
};