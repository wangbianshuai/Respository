import React, { Component } from "react";
import { Common } from "UtilsCommon";
import { Layout, Menu, Icon, Dropdown, Avatar, Breadcrumb, Spin, Modal } from 'antd';
import styles from "../../styles/LeftRightLayout.css"
import MenuConfig from "./Menu";
import Link from 'umi/link';
import router from 'umi/router';
import RightConfig from "./RightConfig";

export default class LeftRightLayout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collapsed: false,
            MenuList: [],
            OpenKeys: null,
            Loading: false
        };

        this.NavSelectedKeys = [];
        this.OpenKeys = [];
        this.MenuList = [];
        this.DefaultPageName = "/SystemManage/UserList";
        this.Token = Common.GetCookie("Token");
        this.JudgeLogin();
        this.PageData = {};
        this.UserId = Common.GetStorage("LoginUserId");

        this.Init();
    }

    Init() {
        const menuConfig = MenuConfig();
        this.NavMenuList = menuConfig.NavMenuList;
        this.Menus = menuConfig.Menus;
        this.UserMenuRight = null;

        this.Menus2 = {};
        this.RightConfig2 = {};
        for (var key in this.Menus) this.Menus2[this.Menus[key].MenuName] = key;
    }

    Alert(msg, title) {
        Modal.info({
            title: title || "提示",
            content: msg
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.IsDestory) return false;
        const isLogin = this.JudgeLogin();
        if (!isLogin) return false;

        return true;
    }

    MapMenu(data) {
        if (!data || data.IsSuccess === false) return;

        const { MenuKeys, PagePropertyNames } = RightConfig;

        if (Common.IsArray(data)) {
            data.forEach(d => {
                const RightPropertyNames = d.RightPropertyNames;

                //获取对应的菜单名
                let menuName = "";
                for (let key in MenuKeys) { if (MenuKeys[key] === d.Key) { menuName = key; break; } }
                d.Key = menuName;

                //获取属性权限
                const names = PagePropertyNames[d.Key];
                if (names) {
                    //有权限属性名集合
                    const rightNameList = [], propertyNameList = [];
                    const hasItem = Common.IsArray(RightPropertyNames) && RightPropertyNames.length > 0;

                    for (let key in names) {
                        propertyNameList.push(key);
                        if (this.RightConfig2[key]) rightNameList.push(key);
                        else if (hasItem && RightPropertyNames.indexOf(names[key]) >= 0) rightNameList.push(key);
                    }

                    //权限属性名集合
                    d.RightPropertyNames = rightNameList;
                    //参与权限设置属性名集合
                    d.PropertyNames = propertyNameList;
                }
            })
        }
    }

    GetPropsValue(key, defaultValue) {
        const value = this[key]
        return value && value.IsSuccess !== false ? value : defaultValue;
    }

    toggle = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    GetCurrentMenuSelectedKeys() {
        let pathname = this.props.location.pathname;
        pathname = pathname.replace(".html", "");
        let keys = pathname === "/" || pathname === "/index" ? [this.DefaultPageName] : [pathname];

        var pageName = keys.length > 0 ? keys[0] : "";

        this.QueryString = Common.GetQueryString();
        this.PageData = Common.GetPageData();

        this.GetNavMenuList();

        let nav = null, menu = null, childMenu = null;
        let blExists = false;
        for (let i = 0; i < this.NavMenuList.length; i++) {
            nav = this.NavMenuList[i];
            if (!nav.IsRight || !this.JudgeVisible(nav)) continue;
            for (let j = 0; j < nav.MenuList.length; j++) {
                menu = nav.MenuList[j];
                if (menu.Children) {
                    if (!menu.IsRight) continue;
                    for (let n = 0; n < menu.Children.length; n++) {
                        if (Common.IsEquals(menu.Children[n].PageName, pageName, true) && menu.Children[n].IsRight) {
                            childMenu = menu.Children[n];
                            blExists = true;
                        }
                    }
                }
                else if (Common.IsEquals(menu.PageName, pageName, true) && menu.IsRight) blExists = true;

                if (blExists) break;
            }

            if (blExists) break;
        }

        this.BreadcrumbList = [];

        if (!blExists) nav = null;

        var nav2 = nav;
        if (this.SelectNav === nav2) this.SelectNav = null;
        else if (this.SelectNav) {
            nav2 = this.SelectNav;
            blExists = false;
        }

        this.IsRight = blExists;

        this.MenuList = nav2 != null ? nav2.MenuList : [];
        this.NavSelectedKeys = nav2 != null ? [nav2.MenuName] : [];

        if (blExists) {
            if (childMenu != null) this.OpenKeys = [menu.MenuName];
            else if (menu.OpenKey) this.OpenKeys = [menu.OpenKey];
            else this.OpenKeys = [];

            this.AddBreadcrumb(nav.MenuName);
            if (menu.ParentMenuName) {
                this.IsRight = this.GetParentMenuRight(menu.ParentMenuName);
                this.AddBreadcrumb(menu.ParentMenuName, menu.ParentPageName, menu.ParentQueryString);
            }
            this.AddBreadcrumb(menu.MenuName, null, null, menu.IsGetMenuName);
            if (childMenu != null) {
                if (childMenu.ParentMenuName) {
                    this.AddBreadcrumb(childMenu.ParentMenuName, childMenu.ParentPageName, childMenu.ParentQueryString);
                    this.IsRight = this.GetParentMenuRight(menu.ParentMenuName);
                }
                this.AddBreadcrumb(childMenu.MenuName, null, null, childMenu.IsGetMenuName);
            }
        }

        if (blExists && !this.IsRight) {
            this.MenuList = [];
            this.NavSelectedKeys = [];
            this.BreadcrumbList = [];
            this.OpenKeys = [];
            blExists = false;
        }

        if (this.IsOnOpenChange) this.SetOpenChange();

        if (blExists) {
            if (childMenu != null) return [childMenu.ParentPageName || childMenu.PageName];
            else if (menu != null) return [menu.ParentPageName || menu.PageName];
        }

        return keys;
    }

    GetNavMenuList() {
        if (this.IsSetRight) return;

        for (var key in this.Menus) this.Menus[key].IsRight = true;

        this.IsSetRight = true;
    }

    GetParentMenuRight(menuName) {
        let menu = null;
        for (let j = 0; j < this.MenuList.length; j++) {
            menu = this.MenuList[j];
            if (Common.IsEquals(menu.MenuName, menuName, true)) return menu.IsRight;
            else if (menu.Children) {
                for (let n = 0; n < menu.Children.length; n++) {
                    if (Common.IsEquals(menu.Children[n].MenuName, menuName, true)) return menu.Children[n].IsRight;
                }
            }
        }

        return true;
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

    SelectMenuClick(item) {
        if (item.key === "ChangePassword") router.push("/ChangePassword");
        else if (item.key === "Logout") router.push("/login")
    }

    RenderUserRightMenuList() {
        return (<Menu selectedKeys={[]} className={styles.UserRightMenu} onClick={this.SelectMenuClick.bind(this)}>
            <Menu.Item key="ChangePassword" className={styles.UserRightMenuItem} ><Icon type="setting" /><span>修改密码</span></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="Logout" className={styles.UserRightMenuItem}><Icon type="logout" /><span>退出登录</span></Menu.Item>
        </Menu>)
    }

    JudgeLogin() {
        if (!this.Token) router.push("/login");
        return !!this.Token
    }

    JudgeVisible(m) {
        return true;
    }

    IsMenuVisible(m) {
        return true;
    }

    GetMenuItem(m, pageName) {
        if (!m.IsVisible || !m.IsRight || !this.IsMenuVisible(m)) return null;
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
        if (this.SelectNav) {
            let menu = null, key = null;
            for (var i = 0; i < this.SelectNav.MenuKeys.length; i++) {
                key = this.SelectNav.MenuKeys[i];
                if (this.Menus[key].IsRight) {
                    menu = this.Menus[key];
                    break;
                }
            }
            if (menu !== null) router.push(this.GetHref(menu.PageName, menu.QueryString));
        }
    }

    OnOpenChange(value) {
        this.IsOnOpenChange = true;
        if (value && value.length > 1) value = [value[value.length - 1]];
        this.setState({ OpenKeys: value });
    }

    componentWillUnmount() {
        this.IsDestory = true;
    }

    Logout() {

    }

    render() {
        if (!this.Token) return null;

        if (this.state.Loading) return <div className="SpinDiv"><Spin tip="加载中……" /></div>

        const { Header, Sider, Content } = Layout;

        const selectedKeys = this.GetCurrentMenuSelectedKeys();

        const pageName = selectedKeys.length > 0 ? selectedKeys[0] : "";

        const loginName = "admin";

        this.props.location.PageData = this.PageData;

        return (
            <Layout style={{ minWidth: 1200 }}>
                <Header style={{ background: '#fff', padding: 0, margin: 0 }}>
                    <div className={styles.logo} >
                        <img src={this.GetImageUrl("logo-3_01.png")} width={30} alt="" />
                        <span>进销存</span>
                    </div>
                    {loginName ? (
                        <Dropdown overlay={this.RenderUserRightMenuList()} >
                            <span className={styles.Dropdown}>
                                <Avatar size="small" src={this.GetImageUrl("UserAvatar.png")} className={styles.avatar} />
                                {loginName}
                            </span>
                        </Dropdown>
                    ) : null}
                    <div className={styles.RightMenu}>
                        <Menu theme="light" mode="horizontal" selectedKeys={this.NavSelectedKeys} onSelect={this.SelectNavMenu.bind(this)} style={{ lineHeight: '64px' }} >
                            {this.NavMenuList.map(m => m.IsRight && m.IsVisible && this.JudgeVisible(m) ? <Menu.Item key={m.MenuName}>{m.MenuName}</Menu.Item> : null)}
                        </Menu>
                    </div>

                </Header>
                <Layout theme="light">
                    <Sider trigger={null} collapsible={true} theme="light" style={{ margin: '16px 0px 16px 16px' }} collapsed={this.state.collapsed}>
                        <Menu theme="light" mode="inline" selectedKeys={selectedKeys} openKeys={this.OpenKeys} onOpenChange={this.OnOpenChange.bind(this)}>
                            {
                                this.MenuList.map(m => m.IsRight && m.Children ? this.IsMenuVisible(m) ?
                                    <Menu.SubMenu key={m.MenuName} title={<span><Icon type={m.IconType} /><span>{m.MenuName}</span></span>}>
                                        {m.Children.map(c => this.GetMenuItem(c, pageName))}
                                    </Menu.SubMenu> : null
                                    : this.GetMenuItem(m, pageName))
                            }
                        </Menu>
                        <div style={{ height: 30 }}></div>
                    </Sider>
                    <Layout>
                        {this.IsRight ?
                            <Header style={{ margin: '16px 16px 0 16px', height: 50, background: '#fff', padding: 0 }}>
                                <Icon className={styles.trigger} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
                                <Breadcrumb className={styles.Breadcrumb} >
                                    {this.BreadcrumbList.map(m => m.Href ? <Breadcrumb.Item key={m.Name}><Link to={m.Href} style={{ color: "#1890ff" }}>{m.Name}</Link></Breadcrumb.Item> : <Breadcrumb.Item key={m.Name} >{m.Name}</Breadcrumb.Item>)}
                                </Breadcrumb>
                            </Header> : null}
                        <Content style={{ margin: '0 16px 16px 16px', padding: 0, minHeight: 500 }}>
                            {this.IsRight ? this.props.children : <div style={{ background: '#fff', marginTop: 16, height: 484 }}></div>}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}