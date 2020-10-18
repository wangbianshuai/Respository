import React, { useCallback, useMemo } from 'react';
import { Flex } from 'antd-mobile';
import Components from 'Components';
import Controls from 'Controls';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/layout.scss';

const _tabBarProperty = Base.getTabBarProperty(styles);
const _searchBarProperty = {
    name: "keyword"
};

export default (props) => {
    const { history, location } = props;
    const pathName = Base.getPathName(location);
    const path = location.pathname || '/home/index';

    const [pageKey, keyword] = useMemo(() => {
        return [Common.createGuid(), Common.getQueryString(location.search).keyword];
    }, [location]);

    const onSubmit = useCallback((v) => {
        let url = `/library/search?keyword=${escape(v)}`;
        url = Common.addUrlRandom(url);
        history.push(url);
    }, [history]);

    return (<Flex style={{ minHeight: "100%", width: "100%" }} direction="column">
        <Flex.Item className={styles.divSearchBar} style={{ flex: 0 }}>
            <div className={styles.divSearchBar}>
                <Controls.SearchBar property={_searchBarProperty} onSubmit={onSubmit} value={keyword} />
            </div>
        </Flex.Item>
        <Flex.Item className={styles.divPage} >
            {Base.getPageComponent(path, props, pageKey)}
        </Flex.Item>
        <Flex.Item className={styles.divTabBar} style={{ flex: 0 }}>
            <Components.TabBar property={_tabBarProperty} pathName={pathName} history={history} />
        </Flex.Item>
    </Flex>)
};