import React, { Component } from "react"
import * as Common from "../utils/Common"
import { Layout, Menu, Icon } from 'antd';
import styles from "../styles/LeftRightLayout.css"
import { Switch, Link, Route } from "dva/router";
import IndexPage from "../routes/Index";

export default class LeftRightLayout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collapsed: false,
            Name: "Abet Order"
        };

        this.MenuList = [
            this.AddMenu("订单编辑", "form", "OrderEdit"),
            this.AddMenu("订单列表", "table", "OrderList"),
            this.AddMenu("加工订单", "table", "ProcessOrderList"),
            this.AddMenu("支收明细", "table", "Bill"),
            this.AddMenu("客户", "table", "Customer"),
            this.AddMenu("用户", "table", "User"),
            this.AddMenu("账目类型", "table", "BillType"),
            this.AddMenu("加工类型", "table", "ProcessType"),
            this.AddMenu("订单模板", "table", "TemplateHtml"),
            this.AddMenu("键值配置", "table", "DictionaryConfig")
        ]
    }

    AddMenu(name, type, pageName) {
        return {
            MenuName: name,
            IconType: type,
            PageName: pageName,
            Id: Common.CreateGuid()
        }
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            Name: this.state.collapsed ? "Abet Order" : "Abet"
        });
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

    render() {
        const { Header, Sider, Content } = Layout;

        const selectedKeys = this.GetCurrentMenuSelectedKeys();

        return (<Layout>
            <Sider trigger={null}
                collapsible
                collapsed={this.state.collapsed}>
                <div className={styles.logo} >
                    <span>{this.state.Name}</span>
                </div>
                <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
                    {
                        this.MenuList.map(m => (
                            <Menu.Item key={m.PageName}>
                                <Link to={"/" + m.PageName}>
                                    <Icon type={m.IconType} />
                                    <span>{m.MenuName}</span>
                                </Link>
                            </Menu.Item>
                        ))
                    }
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0, margin: 0 }}>
                    <Icon
                        className={styles.trigger}
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 450 }}>
                    <Switch>
                        {
                            this.MenuList.map(m => (
                                <Route path={"/" + m.PageName} exact component={() => <IndexPage App={this.props.App} PageName={m.PageName} Id={m.Id} />} key={m.Id} />
                            ))
                        }
                    </Switch>
                </Content>
            </Layout>
        </Layout>)
    }
}