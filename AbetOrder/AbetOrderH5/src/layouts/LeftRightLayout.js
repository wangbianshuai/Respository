import React, { Component } from "react"
import * as Common from "../utils/Common"
import { TabBar, Flex, Icon } from 'antd-mobile';
import SwitchRoute from "./SwitchRoute"
import { routerRedux } from 'dva/router';
import { connect } from "dva";
import styles from '../styles/Index.css';
import PopoverNavBar from "../components/PopoverNavBar"

class LeftRightLayout extends Component {
    constructor(props) {
        super(props)

        this.componentWillMount2();
    }

    componentWillMount2() {
        this.CurrentUser = Common.JsonParse(Common.GetStorage("LoginUserInfo")) || {};

        this.MenuList = [];

        if (this.CurrentUser.DataRight === 1) {
            this.MenuList = [
                this.AddMenu("业务往来", "table", "DealingsBill"),
                this.AddMenu("收支明细", "table", "Bill"),
                this.AddMenu("往来类型", "table", "DealingsBillType"),
                this.AddMenu("账目类型", "table", "BillType"),
                this.AddMenu("个人账目", "table", "PersonBill")
            ]
        }
        else if (this.CurrentUser.DataRight === 2) {
            this.MenuList = [
                this.AddMenu("业务往来", "table", "DealingsBill"),
                this.AddMenu("往来类型", "table", "DealingsBillType"),
                this.AddMenu("个人账目", "table", "PersonBill")
            ]

        }
        else if (this.CurrentUser.DataRight === 3) {
            this.MenuList = [
                this.AddMenu("业务往来", "table", "DealingsBill"),
                this.AddMenu("收支明细", "table", "Bill"),
                this.AddMenu("账目类型", "table", "BillType"),
                this.AddMenu("往来类型", "table", "DealingsBillType"),
                this.AddMenu("个人账目", "table", "PersonBill")
            ]
        }
    }

    AddMenu(name, type, pageName) {
        return {
            MenuName: name,
            IconType: type,
            PageName: pageName,
            Id: Common.CreateGuid()
        }
    }

    GetCurrentMenuSelectedKeys(props) {
        const { location: { pathname } } = props || this.props;
        const keys = pathname.split('/').slice(1);
        if (keys.length === 1 && keys[0] === '') {
            return [this.MenuList[0].PageName];
        }

        return keys.map(m => {
            for (let i = 0; i < this.MenuList.length; i++) {
                if (Common.IsEquals(this.MenuList[i].PageName, m, true)) return this.MenuList[i].PageName;
            }
            return m;
        });
    }

    TabBarItemPress(m) {
        if (Common.IsEquals(m.PageName, this.CurrentPageName, true)) return;

        this.props.ToPage("/" + m.PageName);
    }

    GetMenuName(pageName) {
        const menu = Common.ArrayFirst(this.MenuList, (f) => Common.IsEquals(pageName, f.PageName, true))
        return menu && menu.MenuName ? menu.MenuName : ""
    }

    render() {
        const selectedKeys = this.GetCurrentMenuSelectedKeys();

        const pageName = selectedKeys.length > 0 ? selectedKeys[0] : "";
        this.CurrentPageName = pageName;

        const menuName = this.GetMenuName(pageName);

        return (<Flex style={{ minHeight: "100%", width: "100%" }} direction="column" justify="end">
            <Flex.Item className={styles.DivNavBar}>
                <PopoverNavBar Title={menuName} Logout={() => this.props.ToPage("/Login")} UserName={this.CurrentUser.LoginName || ""} />
            </Flex.Item>
            <Flex.Item className={styles.DivPage}>
                <SwitchRoute MenuList={this.MenuList} App={this.props.App} PageName={pageName} href={window.location.href} />
            </Flex.Item>
            <Flex.Item className={styles.DivTabBar}>
                <TabBar>
                    {
                        this.MenuList.map(m => (
                            <TabBar.Item key={m.PageName} title={m.MenuName}
                                icon={<Icon type="ellipsis" size="md" />}
                                selectedIcon={<Icon type="ellipsis" size="md" />}
                                onPress={this.TabBarItemPress.bind(this, m)}
                                selected={Common.IsEquals(m.PageName, pageName, true)}>
                            </TabBar.Item>
                        ))
                    }
                </TabBar>
            </Flex.Item>
        </Flex>)
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        ToPage(url) { dispatch(routerRedux.replace(url)); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftRightLayout)