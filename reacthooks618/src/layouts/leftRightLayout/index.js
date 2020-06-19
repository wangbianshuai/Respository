import React, { Component } from "react";
import { Common } from "UtilsCommon";
import { Layout, Menu, Icon, Dropdown, Avatar, Breadcrumb, Spin, Modal } from 'antd';
import styles from "../../styles/leftRightLayout.css"
import MenuConfig from "./menu";
import Link from 'umi/link';
import router from 'umi/router';
import RightConfig from "./rightConfig";

export default class LeftRightLayout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collapsed: false,
            menuList: [],
            openKeys: null,
            loading: false
        };

        this.navSelectedKeys = [];
        this.openKeys = [];
        this.menuList = [];
        this.defaultPageName = "/personCenter/appAccountInfo";
        this.token = Common.getCookie("token");
        this.judgeLogin();
        this.pageData = {};
        this.id = Common.getStorage("loginUserId");
        this.loginUser = this.getLoginUser();

        this.init();
    }

    Init() {
        const menuConfig = MenuConfig();
        this.navMenuList = menuConfig.navMenuList;
        this.menus = menuConfig.menus;
        this.userMenuRight = null;
    }

    getLoginUser() {
        var info = Common.getStorage("LoginUserInfo");
        if (!info) return {};

        return JSON.parse(info);
    }

    alert(msg, title) {
        Modal.info({
            title: title || "提示",
            content: msg
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.isDestory) return false;
        const isLogin = this.judgeLogin();
        if (!isLogin) return false;

        return true;
    }

    toggle = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    getCurrentMenuSelectedKeys() {
        let pathname = this.props.location.pathname;
        pathname = pathname.replace(".html", "");
        let keys = pathname === "/" || pathname === "/index" ? [this.defaultPageName] : [pathname];

        var pageName = keys.length > 0 ? keys[0] : "";

        this.queryString = Common.getQueryString();
        this.pageData = Common.getPageData();

        this.getnavMenuList();

        let nav = null, menu = null, childMenu = null;
        let blExists = false;
        for (let i = 0; i < this.navMenuList.length; i++) {
            nav = this.navMenuList[i];
            if (!nav.isRight || !this.judgeVisible(nav)) continue;
            for (let j = 0; j < nav.menuList.length; j++) {
                menu = nav.menuList[j];
                if (menu.children) {
                    if (!menu.isRight) continue;
                    for (let n = 0; n < menu.children.length; n++) {
                        if (Common.isEquals(menu.children[n].pageName, pageName, true) && menu.children[n].isRight) {
                            childMenu = menu.children[n];
                            blExists = true;
                        }
                    }
                }
                else if (Common.isEquals(menu.pageName, pageName, true) && menu.isRight) blExists = true;

                if (blExists) break;
            }

            if (blExists) break;
        }

        this.breadcrumbList = [];

        if (!blExists) nav = null;

        var nav2 = nav;
        if (this.selectNav === nav2) this.selectNav = null;
        else if (this.selectNav) {
            nav2 = this.selectNav;
            blExists = false;
        }

        this.isRight = blExists;

        this.menuList = nav2 != null ? nav2.menuList : [];
        this.navSelectedKeys = nav2 != null ? [nav2.menuName] : [];

        if (blExists) {
            if (childMenu != null) this.openKeys = [menu.menuName];
            else if (menu.openKey) this.openKeys = [menu.openKey];
            else this.openKeys = [];

            this.addBreadcrumb(nav.menuName);
            if (menu.parentMenuName) {
                this.isRight = this.getParentMenuRight(menu.parentMenuName);
                this.addBreadcrumb(menu.parentMenuName, menu.parentPageName, menu.parentQueryString);
            }
            this.addBreadcrumb(menu.menuName, null, null, menu.isGetMenuName);
            if (childMenu != null) {
                if (childMenu.parentMenuName) {
                    this.addBreadcrumb(childMenu.parentMenuName, childMenu.parentPageName, childMenu.parentQueryString);
                    this.isRight = this.getParentMenuRight(menu.parentMenuName);
                }
                this.addBreadcrumb(childMenu.menuName, null, null, childMenu.isGetMenuName);
            }
        }

        if (blExists && !this.isRight) {
            this.menuList = [];
            this.navSelectedKeys = [];
            this.breadcrumbList = [];
            this.openKeys = [];
            blExists = false;
        }

        if (this.isOnOpenChange) this.setOpenChange();

        if (blExists) {
            if (childMenu != null) return [childMenu.parentPageName || childMenu.pageName];
            else if (menu != null) return [menu.parentPageName || menu.pageName];
        }

        return keys;
    }

    getnavMenuList() {
        if (this.isSetRight) return;

        for (var key in this.menus) this.menus[key].isRight = true;

        this.isSetRight = true;
    }

    getParentMenuRight(menuName) {
        let menu = null;
        for (let j = 0; j < this.menuList.length; j++) {
            menu = this.menuList[j];
            if (Common.isEquals(menu.menuName, menuName, true)) return menu.isRight;
            else if (menu.children) {
                for (let n = 0; n < menu.children.length; n++) {
                    if (Common.isEquals(menu.children[n].menuName, menuName, true)) return menu.children[n].isRight;
                }
            }
        }

        return true;
    }

    addBreadcrumb(name, pageName, queryString, isGetMenuName) {
        if (isGetMenuName && this.queryString.menuName) name = this.queryString.menuName
        this.breadcrumbList.push({ name: name, href: this.getHref(pageName, queryString) });
    }

    getHref(pageName, queryString) {
        let href = pageName;
        if (queryString) {
            queryString = Common.replaceDataContent(this.queryString, queryString);
            queryString = Common.replaceDataContent(this.pageData, queryString);
            href += queryString
        }
        return href;
    }

    setOpenChange() {
        const { openKeys } = this.state;
        const selectOpenKey = openKeys && openKeys.length > 0 ? openKeys[0] : "";
        const openKey = this.openKeys && this.openKeys.length > 0 ? this.openKeys[0] : ""
        if (selectOpenKey !== openKey) this.openKeys = openKeys;
        this.isOnOpenChange = false;
    }

    selectMenuClick(item) {
        if (item.key === "ChangePassword") router.push("/personCenter/ChangePassword");
        else if (item.key === "logout") router.push("/login")
    }

    renderUserRightMenuList() {
        return (<Menu selectedKeys={[]} className={styles.UserRightMenu} onClick={this.selectMenuClick.bind(this)}>
            <Menu.Item key="ChangePassword" className={styles.UserRightMenuItem} ><Icon type="setting" /><span>修改密码</span></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" className={styles.UserRightMenuItem}><Icon type="logout" /><span>退出登录</span></Menu.Item>
        </Menu>)
    }

    judgeLogin() {
        if (!this.token) router.push("/login");
        return !!this.token
    }

    judgeVisible(m) {
        return true;
    }

    isMenuVisible(m) {
        return true;
    }

    getMenuItem(m, pageName) {
        if (!m.isVisible || !m.isRight || !this.isMenuVisible(m)) return null;
        return <Menu.Item key={m.pageName} className={styles.MenuItem}>
            {
                Common.isEquals(m.pageName, pageName, true) ?
                    <div>
                        <Icon type={m.iconType} />
                        <span>{m.menuName}</span>
                    </div> :
                    <Link to={this.getHref(m.pageName, m.queryString)}>
                        <Icon type={m.iconType} />
                        <span>{m.menuName}</span>
                    </Link>
            }
        </Menu.Item>
    }

    getImageUrl(name) {
        return require(`../../assets/${name}`);
    }

    selectNavMenu(nav) {
        this.selectNav = Common.arrayFirst(this.navMenuList, (f) => f.menuName === nav.key);
        if (this.selectNav) {
            let menu = null, key = null;
            for (var i = 0; i < this.selectNav.menuKeys.length; i++) {
                key = this.selectNav.menuKeys[i];
                if (this.menus[key] && this.menus[key].isRight) {
                    menu = this.menus[key];
                    break;
                }
            }
            if (menu !== null) router.push(this.getHref(menu.pageName, menu.queryString));
        }
    }

    onOpenChange(value) {
        this.isOnOpenChange = true;
        if (value && value.length > 1) value = [value[value.length - 1]];
        this.setState({ openKeys: value });
    }

    componentWillUnmount() {
        this.isDestory = true;
    }

    render() {
        if (!this.token) return null;

        if (this.state.loading) return <div className="SpinDiv"><Spin tip="加载中……" /></div>

        const { Header, Sider, Content } = Layout;

        const selectedKeys = this.getCurrentMenuSelectedKeys();

        const pageName = selectedKeys.length > 0 ? selectedKeys[0] : "";

        const loginName = this.loginUser.UserName;

        this.props.location.pageData = this.pageData;

        return (
            <Layout style={{ minWidth: 1200 }}>
                <Header style={{ background: '#fff', padding: 0, margin: 0 }}>
                    <div className={styles.logo} >
                        <img src={this.getImageUrl("logo-3_01.png")} width={140} alt="" />
                        <span>A2 Digital Solution</span>
                    </div>
                    {loginName ? (
                        <Dropdown overlay={this.renderUserRightMenuList()} >
                            <span className={styles.Dropdown}>
                                <Avatar size="small" src={this.getImageUrl("UserAvatar.png")} className={styles.avatar} />
                                {loginName}
                            </span>
                        </Dropdown>
                    ) : null}
                    <div className={styles.RightMenu}>
                        <Menu theme="light" mode="horizontal" selectedKeys={this.navSelectedKeys} onSelect={this.selectNavMenu.bind(this)} style={{ lineHeight: '64px' }} >
                            {this.navMenuList.map(m => m.isRight && m.isVisible && this.judgeVisible(m) ? <Menu.Item key={m.menuName}>{m.menuName}</Menu.Item> : null)}
                        </Menu>
                    </div>

                </Header>
                <Layout theme="light">
                    <Sider trigger={null} collapsible={true} theme="light" style={{ margin: '16px 0px 16px 16px' }} collapsed={this.state.collapsed}>
                        <Menu theme="light" mode="inline" selectedKeys={selectedKeys} openKeys={this.openKeys} onOpenChange={this.onOpenChange.bind(this)}>
                            {
                                this.menuList.map(m => m.isRight && m.children ? this.isMenuVisible(m) ?
                                    <Menu.SubMenu key={m.menuName} title={<span><Icon type={m.iconType} /><span>{m.menuName}</span></span>}>
                                        {m.children.map(c => this.getMenuItem(c, pageName))}
                                    </Menu.SubMenu> : null
                                    : this.getMenuItem(m, pageName))
                            }
                        </Menu>
                        <div style={{ height: 30 }}></div>
                    </Sider>
                    <Layout>
                        {this.isRight ?
                            <Header style={{ margin: '16px 16px 0 16px', height: 50, background: '#fff', padding: 0 }}>
                                <Icon className={styles.trigger} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
                                <Breadcrumb className={styles.Breadcrumb} >
                                    {this.breadcrumbList.map(m => m.href ? <Breadcrumb.Item key={m.name}><Link to={m.href} style={{ color: "#1890ff" }}>{m.name}</Link></Breadcrumb.Item> : <Breadcrumb.Item key={m.name} >{m.name}</Breadcrumb.Item>)}
                                </Breadcrumb>
                            </Header> : null}
                        <Content style={{ margin: '0 16px 16px 16px', padding: 0, minHeight: 500 }}>
                            {this.isRight ? this.props.children : <div style={{ background: '#fff', marginTop: 16, height: 484 }}></div>}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}