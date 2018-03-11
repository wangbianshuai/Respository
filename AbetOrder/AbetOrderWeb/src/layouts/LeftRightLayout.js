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
            this.AddMenu("内容编辑", "form", "ContentEdit"),
            this.AddMenu("内容列表", "table", "ContentList"),
            this.AddMenu("内容推荐", "table", "ContentRecommend"),
            this.AddMenu("内容频道", "table", "ContentChannel"),
            this.AddMenu("内容标签", "table", "ContentTag"),
            this.AddMenu("HTML模板", "table", "TemplateHtml"),
            this.AddMenu("静态资源", "table", "StaticSource"),
            this.AddMenu("键值配置", "table", "DictionaryConfig")
        ]
    }

    AddMenu(name, type, pageName) {
        return {
            MenuName: name,
            IconType: type,
            PageName: pageName
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
        return keys;
    }

    render() {
        const { Header, Sider, Content } = Layout;

        const selectKeys = this.GetCurrentMenuSelectedKeys();

        return (<Layout>
            <Sider trigger={null}
                collapsible
                collapsed={this.state.collapsed}>
                <div className={styles.logo} >
                    <span>{this.state.Name}</span>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={selectKeys}>
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
                                <Route path={"/" + m.PageName} exact component={() => <IndexPage App={this.props.App} PageName={m.PageName} />} key={Common.CreateGuid()} />
                            ))
                        }
                    </Switch>
                </Content>
            </Layout>
        </Layout>)
    }
}