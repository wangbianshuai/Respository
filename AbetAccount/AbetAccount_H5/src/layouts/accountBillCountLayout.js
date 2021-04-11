import React from 'react';
import AccountBillCount from '../routes/accountBillCount';
import styles from '../styles/layout.scss';
import { Flex } from 'antd-mobile';
import Components from 'Components';
import { Common } from 'UtilsCommon';
import Base from './base';

const isH5 = Common.isH5();

const _tabBarProperty = Base.getMatchmakerTabBarProperty(styles);

export default (props) => {
    const { history } = props;
    let style = { minHeight: "100%", width: "100%" };
    if (!isH5) style = { minHeight: "100%", width: '480px', margin: "0 auto" }

    return (<div style={style}><Flex style={style} direction="column" className={styles.divLayout}>
        <Flex.Item className={styles.divPage} >
            <div className={styles.divList}><AccountBillCount {...props} /></div>
        </Flex.Item>
        <Flex.Item className={styles.divTabBar} style={{ flex: 0 }}>
            <Components.TabBar property={_tabBarProperty} pathName='accountBill' history={history} />
        </Flex.Item>
    </Flex></div>)
};