import React, { Component } from "react";
import { Common, EnvConfig } from "UtilsCommon";
import { Layout, Menu, Icon, Dropdown, Avatar, Breadcrumb, Spin } from 'antd';
import styles from "../../styles/LeftRightLayout.css"
import MenuConfig from "./Menu";
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from "dva";
import RightConfig from "./RightConfig";

class LeftRightLayout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collapsed: false,
            MenuList: [],
            OpenKeys: null
        };

        this.NavSelectedKeys = [];
        this.OpenKeys = [];
        this.MenuList = [];
        this.DefaultPageName = "/Orders/OrderList";
        this.Token = Common.GetStorage("Token");
        this.JudgeLogin();
        this.PageData = {};

        this.Init();
    }

    Init() {
        this.NavMenuList = MenuConfig.NavMenuList;
        this.Menus = MenuConfig.Menus;

        this.props.Dispatch("MenuEmployeeService/GetEmployeeInfo", { Token: this.Token });
        this.props.Dispatch("MenuUserService/GetUserMenuRight", { Token: this.Token });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const isLogin = this.JudgeLogin();
        if (!isLogin) return false;

        if (nextProps.GetUserMenuRight !== this.props.GetUserMenuRight) this.MapMenu(nextProps.GetUserMenuRight);

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
                        if (hasItem && RightPropertyNames.indexOf(names[key]) >= 0) rightNameList.push(key);
                    }

                    //权限属性名集合
                    d.RightPropertyNames = rightNameList;
                    //参与权限设置属性名集合
                    d.PropertyNames = propertyNameList;
                }
            })
        }
    }

    GetPropsValue(props, key, defaultValue) {
        const value = props[key]
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

        this.IsRight = blExists;

        this.BreadcrumbList = [];

        if (!blExists) nav = null;

        var nav2 = nav;
        if (this.SelectNav === nav2) this.SelectNav = null;
        else if (this.SelectNav) nav2 = this.SelectNav;

        this.MenuList = nav2 != null ? nav2.MenuList : [];
        this.NavSelectedKeys = nav2 != null ? [nav2.MenuName] : [];

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

    GetNavMenuList() {
        if (this.IsSetRight) return;
        const { GetUserMenuRight } = this.props;

        GetUserMenuRight.forEach(m => { if (this.Menus[m.Key]) this.Menus[m.Key].IsRight = true; });

        this.IsSetRight = true;
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
        if (item.key === "PersonCenter") router.push("/PersonCenter/BaseInfo");
        else if (item.key === "Logout") {
            this.props.Dispatch("EmployeeService/Logout", { Token: this.Token });
            router.push("/login");
        }
    }

    RenderUserRightMenuList() {
        return (<Menu selectedKeys={[]} className={styles.UserRightMenu} onClick={this.SelectMenuClick.bind(this)}>
            <Menu.Item key="PersonCenter" className={styles.UserRightMenuItem} ><Icon type="setting" /><span>个人中心</span></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="Logout" className={styles.UserRightMenuItem}><Icon type="logout" /><span>退出登录</span></Menu.Item>
        </Menu>)
    }

    JudgeLogin() {
        if (!this.Token) router.push("/Login");
        return !!this.Token
    }

    JudgeVisible(m) {
        if (m.Key === "OrderWorkManage" || m.Key === "ApprovalManage") {
            const { OrderCode } = this.QueryString
            if (Common.IsNullOrEmpty(OrderCode)) return false
        }
        return true;
    }

    GetMenuItem(m, pageName) {
        if (!m.IsVisible || !m.IsRight) return null;
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
        if (!this.Token) return null;

        if (this.props.Loading) return <div className="SpinDiv"><Spin tip="加载中……" /></div>

        const GetEmployeeInfo = this.GetPropsValue(this.props, "GetEmployeeInfo", {});

        const GetUserMenuRight = this.GetPropsValue(this.props, "GetUserMenuRight", []);

        if (!GetEmployeeInfo.LoginName || GetUserMenuRight.length === 0) return null;

        const { Header, Sider, Content } = Layout;

        const selectedKeys = this.GetCurrentMenuSelectedKeys();

        const pageName = selectedKeys.length > 0 ? selectedKeys[0] : "";

        const loginName = GetEmployeeInfo.LoginName;

        this.PageData.GetEmployeeInfo = GetEmployeeInfo;
        this.PageData.GetUserMenuRight = GetUserMenuRight;
        this.props.location.PageData = this.PageData;

        console.log(this.props.children)
        return (
            <Layout style={{ minWidth: 1200 }}>
                <Header style={{ background: '#fff', padding: 0, margin: 0 }}>
                    <div className={styles.logo} >
                        <img src={this.GetImageUrl("logo-3_01.png")} width={30} alt="" />
                        <span>风控审批系统</span>
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
                                this.MenuList.map(m => m.IsRight && m.Children ?
                                    <Menu.SubMenu key={m.MenuName} title={<span><Icon type={m.IconType} /><span>{m.MenuName}</span></span>}>
                                        {m.Children.map(c => this.GetMenuItem(c, pageName))}
                                    </Menu.SubMenu>
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

function mapStateToProps(state) {
    const props = {
        Loading: state.MenuUserService.Loading || state.MenuEmployeeService.Loading,
        GetEmployeeInfo: state.MenuEmployeeService.GetEmployeeInfo,
        GetUserMenuRight: state.MenuUserService.GetUserMenuRight
    }

    !EnvConfig.IsProd && console.log(props);

    return props;
}

function mapDispatchToProps(dispatch) {
    return {
        Dispatch(type, payload, isloading) { return dispatch({ type, payload, isloading }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftRightLayout)