import React, { useEffect } from 'react';
import AccountCategoryEdit from '../routes/accountCategoryEdit';
import AccountCategoryList from '../routes/accountCategoryList';
import styles from '../styles/layout.scss';
import { Flex } from 'antd-mobile';
import Components from 'Components';
import { Common } from 'UtilsCommon';
import Base from './base';

var _isList = false;
const isH5 = Common.isH5();

const _tabBarProperty = Base.getMatchmakerTabBarProperty(styles);

export default (props) => {
    const { history, location } = props;
    const path = location.pathname.toLowerCase();
    const isDetail = path.indexOf('/accountcategoryedit.html') >= 0
    if (!_isList) _isList = path.indexOf('/accountcategorylist.html') >= 0;

    useEffect(() => { return () => _isList = false }, []);

    let style = { minHeight: "100%", width: "100%" };
    if (!isH5) style = { minHeight: "100%", width: '480px', margin: "0 auto" }

    return (<div style={style}><Flex style={style} direction="column" className={styles.divLayout}>
        <Flex.Item className={isDetail ? styles.divPage2 : styles.divPage} >
            {_isList && <div className={styles.divList} style={{ display: isDetail ? 'none' : '' }}><AccountCategoryList {...props} /></div>}
            {isDetail && <AccountCategoryEdit {...props} />}
        </Flex.Item>
        {!isDetail && <Flex.Item className={styles.divTabBar} style={{ flex: 0 }}>
            <Components.TabBar property={_tabBarProperty} pathName='setting' history={history} />
        </Flex.Item>}
    </Flex></div>)
};