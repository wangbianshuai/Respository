import React, { useCallback, useMemo, useState } from 'react';
import { Flex } from 'antd-mobile';
import Controls from 'Controls';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/layout.scss';
import DetailBottomButton from '../page-components/detailBottomButton';

const _searchBarProperty = {
    name: "keyword"
};

const getInitButtonVisible = (path) => {
    if (path.toLowerCase().indexOf("activityform") > 0) return false;

    return true;
}

export default (props) => {
    const { history, location } = props;
    const path = location.pathname;
    const [bottomVisible, setBottomVisible] = useState(getInitButtonVisible(path))

    const [pageKey, keyword] = useMemo(() => {
        location.pageData = { setBottomVisible: (v) => setBottomVisible(v) };
        return [Common.createGuid(), Common.getQueryString(location.search).keyword];
    }, [location, setBottomVisible]);

    const onSubmit = useCallback((v) => {
        let url = `/library/search?keyword=${escape(v)}`;
        url = Common.addUrlRandom(url);
        history.push(url);
    }, [history]);

    const divPageClassName = bottomVisible ? 'divPage' : 'divPage3';

    return (<Flex style={{ minHeight: "100%", width: "100%" }} direction="column">
        <Flex.Item className={styles.divSearchBar} style={{ flex: 0 }}>
            <div className={styles.divSearchBar}>
                <Controls.SearchBar property={_searchBarProperty} onSubmit={onSubmit} value={keyword} />
            </div>
        </Flex.Item>
        <Flex.Item className={styles[divPageClassName]} >
            {Base.getPageComponent(path, props, pageKey)}
        </Flex.Item>
        {bottomVisible && <Flex.Item className={styles.divBottomButton} style={{ flex: 0 }}>
            <DetailBottomButton pageData={location.pageData} />
        </Flex.Item>}
    </Flex>)
};