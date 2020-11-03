import React, { useMemo } from 'react';
import { Flex } from 'antd-mobile';
import Components from 'Components';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/layout.scss';

const isH5 = Common.isH5();

const _tabBarProperty = Base.getMarriageUserTabBarProperty(styles);

export default (props) => {
    const { history, location } = props;
    const pathName = Base.getPathName(location);
    const path = location.pathname || 'index';

    const [pageKey] = useMemo(() => {
        return [Common.createGuid()];
    }, [location]);

    let style = { minHeight: "100%", width: "100%" };
    if (!isH5) style = { minHeight: "100%", width: '480px', margin: "0 auto", boxSizing: 'border-box', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }

    return (<Flex style={style} direction="column">
        <Flex.Item className={styles.divPage} >
            {Base.getPageComponent(path, props, pageKey)}
        </Flex.Item>
        <Flex.Item className={styles.divTabBar} style={{ flex: 0 }}>
            <Components.TabBar property={_tabBarProperty} pathName={pathName} history={history} />
        </Flex.Item>
    </Flex>)
};