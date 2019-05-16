import React, { Component } from "react";
import { Common } from "UtilsCommon";
import { Layout, Menu, Icon, Dropdown, Avatar, Breadcrumb } from 'antd';
import styles from "../../styles/LeftRightLayout.css"
import NavMenuList from "./Menu";
import Link from 'umi/link';

export default class LeftRightLayout extends Component {
    constructor(props) {
        super(props)

        this.Init();

        this.state = {
            collapsed: false,
            MenuList: [],
            OpenKeys: null
        };

        this.NavSelectedKeys = [];
        this.OpenKeys = [];
        this.MenuList = [];
        this.DefaultPageName = "/Orders/OrderList";

        this.CurrentUser = { LoginName: "admin" };
    }

    Init() {
        this.NavMenuList = NavMenuList;
    }

    toggle = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    GetCurrentMenuSelectedKeys() {
        let pathname = this.props.location.pathname;
        pathname = pathname.replace(".html", "");
        let keys = pathname === "/" || pathname === "/index" ? [this.DefaultPageName] : [pathname];

        var pageName = keys.length > 0 ? keys[0] : "";

        let nav = null, menu = null, childMenu = null;
        let blExists = false;
        for (let i = 0; i < this.NavMenuList.length; i++) {
            nav = this.NavMenuList[i];
            for (let j = 0; j < nav.MenuList.length; j++) {
                menu = nav.MenuList[j];
                if (menu.Children) {
                    for (let n = 0; n < menu.Children.length; n++) {
                        if (Common.IsEquals(menu.Children[n].PageName, pageName, true)) {
                            childMenu = menu.Children[n];
                            blExists = true;
                        }
                    }
                }
                else if (Common.IsEquals(menu.PageName, pageName, true)) blExists = true;

                if (blExists) break;
            }

            if (blExists) break;
        }

        this.BreadcrumbList = [];

        this.QueryString = Common.GetQueryString();
        this.PageData = Common.GetPageData();

        if (!blExists) nav = null;
        if (this.SelectNav === nav) this.SelectNav = null;
        else if (this.SelectNav) { nav = this.SelectNav; }

        this.MenuList = nav != null ? nav.MenuList : [];
        this.NavSelectedKeys = nav != null ? [nav.MenuName] : [];

        if (blExists) {
            if (childMenu != null) this.OpenKeys = [menu.MenuName];
            else this.OpenKeys = [];

            this.AddBreadcrumb(nav.MenuName);
            if (menu.ParentMenuName) this.AddBreadcrumb(menu.ParentMenuName, menu.ParentPageName, menu.ParentQueryString);
            this.AddBreadcrumb(menu.MenuName, null, null, menu.IsGetMenuName);
            if (childMenu != null) {
                if (childMenu.ParentMenuName) this.AddBreadcrumb(childMenu.ParentMenuName, childMenu.ParentPageName, childMenu.ParentQueryString);
                this.AddBreadcrumb(childMenu.MenuName, null, null, childMenu.IsGetMenuName);
            }
        }

        if (this.IsOnOpenChange) this.SetOpenChange();

        if (blExists) {
            if (childMenu != null) return [childMenu.ParentPageName || childMenu.PageName];
            else if (menu != null) return [menu.ParentPageName || menu.PageName];
        }

        return keys;
    }

    AddBreadcrumb(name, pageName, queryString, isGetMenuName) {
        if (isGetMenuName && this.QueryString.MenuName) name = this.QueryString.MenuName
        this.BreadcrumbList.push({ Name: name, Href: this.GetHref(pageName, queryString) });
    }

    GetHref(pageName, queryString) {
        let href = pageName;
        if (queryString) {
            queryString = Common.ReplaceDataContent(this.QueryString, queryString);
            queryString = Common.ReplaceDataContent(this.PageData, queryString);
            href += queryString
        }
        return href;
    }

    SetOpenChange() {
        const { OpenKeys } = this.state;
        const selectOpenKey = OpenKeys && OpenKeys.length > 0 ? OpenKeys[0] : "";
        const openKey = this.OpenKeys && this.OpenKeys.length > 0 ? this.OpenKeys[0] : ""
        if (selectOpenKey !== openKey) this.OpenKeys = OpenKeys;
        this.IsOnOpenChange = false;
    }

    SelectMenuClick() {

    }

    RenderUserRightMenuList() {
        return (<Menu selectedKeys={[]} className={styles.UserRightMenu} onClick={this.SelectMenuClick.bind(this)}>
            <Menu.Item key="ChangePassword" className={styles.UserRightMenuItem} ><Icon type="setting" /><span>修改密码</span></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" className={styles.UserRightMenuItem}><Icon type="logout" /><span>退出登录</span></Menu.Item>
        </Menu>)
    }

    GetMenuItem(m, pageName) {
        if (!m.IsVisible) return null;
        return <Menu.Item key={m.PageName}>
            {
                Common.IsEquals(m.PageName, pageName, true) ?
                    <div>
                        <Icon type={m.IconType} />
                        <span>{m.MenuName}</span>
                    </div> :
                    <Link to={this.GetHref(m.PageName, m.QueryString)}>
                        <Icon type={m.IconType} />
                        <span>{m.MenuName}</span>
                    </Link>
            }
        </Menu.Item>
    }

    GetImageUrl(name) {
        return require(`../../assets/${name}`);
    }

    SelectNavMenu(nav) {
        this.SelectNav = Common.ArrayFirst(this.NavMenuList, (f) => f.MenuName === nav.key);
        if (this.SelectNav) this.setState({ MenuList: this.SelectNav.MenuList, OpenKeys: null });
    }

    OnOpenChange(value) {
        this.IsOnOpenChange = true;
        if (value && value.length > 1) value = [value[value.length - 1]];
        this.setState({ OpenKeys: value });
    }

    render() {
        const { Header, Sider, Content } = Layout;

        const selectedKeys = this.GetCurrentMenuSelectedKeys();

        const pageName = selectedKeys.length > 0 ? selectedKeys[0] : "";

        return (
            <Layout style={{ minWidth: 1200 }}>
                <Header style={{ background: '#fff', padding: 0, margin: 0 }}>
                    <div className={styles.logo} >
                        <img src={this.GetImageUrl("logo-3_01.png")} width={30} alt="" />
                        <span>风控审批系统</span>
                    </div>
                    {this.CurrentUser.LoginName ? (
                        <Dropdown overlay={this.RenderUserRightMenuList()} >
                            <span className={styles.Dropdown}>
                                <Avatar size="small" src={this.GetImageUrl("UserAvatar.png")} className={styles.avatar} />
                                {this.CurrentUser.LoginName}
                            </span>
                        </Dropdown>
                    ) : null}
                    <div className={styles.RightMenu}>
                        <Menu theme="light" mode="horizontal" selectedKeys={this.NavSelectedKeys} onSelect={this.SelectNavMenu.bind(this)} style={{ lineHeight: '64px' }} >
                            {this.NavMenuList.map(m => <Menu.Item key={m.MenuName}>{m.MenuName}</Menu.Item>)}
                        </Menu>
                    </div>

                </Header>
                <Layout theme="light">
                    <Sider trigger={null} collapsible={true} theme="light" style={{ margin: '16px 0px 16px 16px' }} collapsed={this.state.collapsed}>
                        <Menu theme="light" mode="inline" selectedKeys={selectedKeys} openKeys={this.OpenKeys} onOpenChange={this.OnOpenChange.bind(this)}>
                            {
                                this.MenuList.map(m => m.Children ?
                                    <Menu.SubMenu key={m.MenuName} title={<span><Icon type={m.IconType} /><span>{m.MenuName}</span></span>}>
                                        {m.Children.map(c => this.GetMenuItem(c, pageName))}
                                    </Menu.SubMenu>
                                    : this.GetMenuItem(m, pageName))
                            }
                        </Menu>
                        <div style={{ height: 30 }}></div>
                    </Sider>
                    <Layout>
                        <Header style={{ margin: '16px 16px 0 16px', height: 50, background: '#fff', padding: 0 }}>
                            <Icon className={styles.trigger} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
                            <Breadcrumb className={styles.Breadcrumb} >
                                {this.BreadcrumbList.map(m => m.Href ? <Breadcrumb.Item key={m.Name}><Link to={m.Href} style={{ color: "#1890ff" }}>{m.Name}</Link></Breadcrumb.Item> : <Breadcrumb.Item key={m.Name} >{m.Name}</Breadcrumb.Item>)}
                            </Breadcrumb>
                        </Header>
                        <Content style={{ margin: '0 16px 16px 16px', padding: 0, minHeight: 500 }}>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}