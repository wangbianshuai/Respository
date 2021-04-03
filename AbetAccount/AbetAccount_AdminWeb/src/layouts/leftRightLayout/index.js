import React, { useState, useCallback, useMemo } from "react";
import { Common } from "UtilsCommon";
import { Layout, Menu, Icon, Dropdown, Avatar, Breadcrumb } from 'antd';
import styles from "../../styles/leftRightLayout.css"
import MenuConfig from "./menu";
import Link from 'umi/link';
import router from 'umi/router';

const { Header, Sider, Content } = Layout;

const getLoginUser = () => {
    var info = Common.getStorage("loginUserInfo");
    if (!info) return {};

    return JSON.parse(info);
};

const judgeLogin = (token) => {
    if (!token) router.push("/login");
    return !!token
};

const judgeVisible = (m) => {
    return true;
};

const isMenuVisible = (m) => {
    return true;
};

const setOpenChange = (openKeys, stateOpenKeys) => {
    const selectOpenKey = stateOpenKeys && stateOpenKeys.length > 0 ? stateOpenKeys[0] : "";
    const openKey = openKeys && openKeys.length > 0 ? openKeys[0] : ""
    if (selectOpenKey !== openKey) openKeys = stateOpenKeys;
    return openKeys;
};

const getParentMenuRight = (menuName, menuList) => {
    let menu = null;
    for (let j = 0; j < menuList.length; j++) {
        menu = menuList[j];
        if (Common.isEquals(menu.menuName, menuName, true)) return menu.isRight;
        else if (menu.children) {
            for (let n = 0; n < menu.children.length; n++) {
                if (Common.isEquals(menu.children[n].menuName, menuName, true)) return menu.children[n].isRight;
            }
        }
    }

    return true;
};

const getHref = (parenPageName, parentQueryString, queryString) => {
    let href = parenPageName;
    if (parentQueryString) {
        parentQueryString = Common.replaceDataContent(queryString, parentQueryString, true);
        href += parentQueryString
    }
    return href;
}

const addBreadcrumb = (name, parenPageName, parentQueryString, isGetMenuName, breadcrumbList, queryString) => {
    if (isGetMenuName && queryString.menuName) name = queryString.menuName
    breadcrumbList.push({ name: name, href: getHref(parenPageName, parentQueryString) });
}

const renderUserRightMenuList = (onSelectMenuClick) => {
    return (<Menu selectedKeys={[]} className={styles.userRightMenu} onClick={onSelectMenuClick}>
        <Menu.Item key="changePassword" className={styles.userRightMenuItem} ><Icon type="setting" /><span>修改密码</span></Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout" className={styles.userRightMenuItem}><Icon type="logout" /><span>退出登录</span></Menu.Item>
    </Menu>)
};

const getMenuItem = (m, pageName, queryString) => {
    if (!m.isVisible || !m.isRight || !isMenuVisible(m)) return null;
    return <Menu.Item key={m.pageName} className={styles.menuItem}>
        {
            Common.isEquals(m.pageName, pageName, true) ?
                <div>
                    <Icon type={m.iconType} />
                    <span>{m.menuName}</span>
                </div> :
                <Link to={getHref(m.pageName, m.queryString, queryString)}>
                    <Icon type={m.iconType} />
                    <span>{m.menuName}</span>
                </Link>
        }
    </Menu.Item>
};

const getImageUrl = (name) => {
    return require(`../../assets/${name}`);
};

const selectNavMenu = (nav, menus, navMenuList, queryString) => {
    const selectNav = Common.arrayFirst(navMenuList, (f) => f.menuName === nav.key);
    if (selectNav) {
        let menu = null, key = null;
        for (var i = 0; i < selectNav.menuKeys.length; i++) {
            key = selectNav.menuKeys[i];
            if (menus[key] && menus[key].isRight) {
                menu = menus[key];
                break;
            }
        }
        if (menu !== null) router.push(getHref(menu.pageName, menu.queryString, queryString));
    }
    return selectNav;
}

const setMenusRight = (obj) => {
    if (obj.isSetRight) return;

    for (var key in obj.menus) obj.menus[key].isRight = true;

    obj.isSetRight = true;
};

const getCurrentMenuSelectedKeys = (props, obj, stateOpenKeys, queryString) => {
    const { navMenuList, defaultPageName } = obj;
    let pathname = props.location.pathname;
    pathname = pathname.replace(".html", "");
    let keys = pathname === "/" || pathname === "/index" ? [defaultPageName] : [pathname];

    var pageName = keys.length > 0 ? keys[0] : "";

    setMenusRight(obj);

    let nav = null, menu = null, childMenu = null;
    let blExists = false;
    for (let i = 0; i < navMenuList.length; i++) {
        nav = navMenuList[i];
        if (!nav.isRight || !judgeVisible(nav)) continue;
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

    let breadcrumbList = [];

    if (!blExists) nav = null;

    var nav2 = nav;
    if (obj.selectNav === nav2) obj.selectNav = null;
    else if (obj.selectNav) {
        nav2 = obj.selectNav;
        blExists = false;
    }

    let isRight = blExists;
    let openKeys = [];

    let menuList = nav2 != null ? nav2.menuList : [];
    let navSelectedKeys = nav2 != null ? [nav2.menuName] : [];

    if (blExists) {
        if (childMenu != null) openKeys = [menu.menuName];
        else if (menu.openKey) openKeys = [menu.openKey];

        addBreadcrumb(nav.menuName, null, null, false, breadcrumbList, queryString);
        if (menu.parentMenuName) {
            isRight = getParentMenuRight(menu.parentMenuName, menuList);
            addBreadcrumb(menu.parentMenuName, menu.parentPageName, menu.parentQueryString, false, breadcrumbList, queryString);
        }
        addBreadcrumb(menu.menuName, null, null, menu.isGetMenuName, breadcrumbList, queryString);
        if (childMenu != null) {
            if (childMenu.parentMenuName) {
                addBreadcrumb(childMenu.parentMenuName, childMenu.parentPageName, childMenu.parentQueryString, false, breadcrumbList, queryString);
                isRight = getParentMenuRight(menu.parentMenuName, menuList);
            }
            addBreadcrumb(childMenu.menuName, null, null, childMenu.isGetMenuName, breadcrumbList, queryString);
        }
    }

    if (blExists && !isRight) {
        menuList = [];
        navSelectedKeys = [];
        breadcrumbList = [];
        openKeys = [];
        blExists = false;
    }

    if (obj.isOnOpenChange) {
        openKeys = setOpenChange(openKeys, stateOpenKeys);
        obj.isOnOpenChange = false;
    }

    if (blExists) {
        if (childMenu != null) keys = [childMenu.parentPageName || childMenu.pageName];
        else if (menu != null) keys = [menu.parentPageName || menu.pageName];
    }

    return [keys, menuList, navSelectedKeys, breadcrumbList, openKeys, isRight];
};

const init = () => {
    const { navMenuList, menus } = MenuConfig();

    return {
        isOnOpenChange: false,
        token: Common.getStorage("token"),
        loginUser: getLoginUser(),
        defaultPageName: "/systemManage/dictionaryConfigList",
        navMenuList,
        menus
    }
}

export default (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [stateOpenKeys, setStateOpenKeys] = useState(null);

    const obj = useMemo(() => init(), []);
    const queryString = Common.getQueryString();

    const onToggle = useCallback(() => {
        setCollapsed(!collapsed);
    }, [collapsed, setCollapsed]);

    const onOpenChange = useCallback((value) => {
        obj.isOnOpenChange = true;
        if (value && value.length > 1) value = [value[value.length - 1]];
        setStateOpenKeys(value);
    }, [obj, setStateOpenKeys]);

    const onSelectMenuClick = useCallback((item) => {
        if (item.key === "changePassword") router.push("/personCenter/changePassword");
        else if (item.key === "logout") router.push("/login");
    }, []);

    const onSelectNavMenu = useCallback((nav) => {
        obj.selectNav = selectNavMenu(nav, obj.menus, obj.navMenuList, queryString);
    }, [obj, queryString])

    if (!judgeLogin(obj.token)) return null;

    const [selectedKeys, menuList, navSelectedKeys, breadcrumbList, openKeys, isRight] = getCurrentMenuSelectedKeys(props, obj, stateOpenKeys, queryString);

    const pageName = selectedKeys.length > 0 ? selectedKeys[0] : "";

    const loginName = obj.loginUser.UserName;

    return (
        <Layout style={{ minWidth: 1200 }}>
            <Header style={{ background: '#fff', padding: 0, margin: 0 }}>
                <div className={styles.logo} >
                    <img src={getImageUrl("logo.png")} height={42} alt="" />
                    <span>Abet-记账</span>
                </div>
                {loginName ? (
                    <Dropdown overlay={renderUserRightMenuList(onSelectMenuClick)} >
                        <span className={styles.dropdown}>
                            <Avatar size="small" src={getImageUrl("userAvatar.png")} className={styles.avatar} />
                            {loginName}
                        </span>
                    </Dropdown>
                ) : null}
                <div className={styles.rightMenu}>
                    <Menu theme="light" mode="horizontal" selectedKeys={navSelectedKeys} onSelect={onSelectNavMenu} style={{ lineHeight: '64px' }} >
                        {obj.navMenuList.map(m => m.isRight && m.isVisible && judgeVisible(m) ? <Menu.Item key={m.menuName}>{m.menuName}</Menu.Item> : null)}
                    </Menu>
                </div>

            </Header>
            <Layout theme="light">
                <Sider trigger={null} collapsible={true} theme="light" style={{ margin: '16px 0px 16px 16px' }} collapsed={collapsed}>
                    <Menu theme="light" mode="inline" selectedKeys={selectedKeys} openKeys={openKeys} onOpenChange={onOpenChange}>
                        {
                            menuList.map(m => m.isRight && m.children ? isMenuVisible(m) ?
                                <Menu.SubMenu key={m.menuName} title={<span><Icon type={m.iconType} /><span>{m.menuName}</span></span>}>
                                    {m.children.map(c => getMenuItem(c, pageName, queryString))}
                                </Menu.SubMenu> : null
                                : getMenuItem(m, pageName, queryString))
                        }
                    </Menu>
                    <div style={{ height: 30 }}></div>
                </Sider>
                <Layout>
                    {isRight ?
                        <Header style={{ margin: '16px 16px 0 16px', height: 50, background: '#fff', padding: 0 }}>
                            <Icon className={styles.trigger} type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={onToggle} />
                            <Breadcrumb className={styles.breadcrumb} >
                                {breadcrumbList.map(m => m.href ? <Breadcrumb.Item key={m.name}><Link to={m.href} style={{ color: "#1890ff" }}>{m.name}</Link></Breadcrumb.Item> : <Breadcrumb.Item key={m.name} >{m.name}</Breadcrumb.Item>)}
                            </Breadcrumb>
                        </Header> : null}
                    <Content style={{ margin: '0 16px 16px 16px', padding: 0, minHeight: 500 }}>
                        {isRight ? props.children : <div style={{ background: '#fff', marginTop: 16, height: 484 }}></div>}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
};