import React, { Component } from "react";
import { Common, EnvConfig, AjaxRequest, HttpResponse } from "UtilsCommon";
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
            Loading: true
        };

        this.NavSelectedKeys = [];
        this.OpenKeys = [];
        this.MenuList = [];
        this.DefaultPageName = "/PersonCenter/BaseInfo";
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

        Promise.all([this.GetEmployeeInfo(), this.GetUserMenuRight()]).then(res => {
            this.EmployeeInfo = res[0];
            const res1 = res[1];
            if (res1 && res1.IsSuccess === false) {
                if (res1.IsReLogin) router.push("/login");
                else this.Alert(res1.Message);
                return;
            }

            !EnvConfig.IsProd && console.log(res1);
            this.UserMenuRight = this.SetMenuRightMap(res1);
            this.MapMenu(this.UserMenuRight);
            !EnvConfig.IsProd && console.log(this.UserMenuRight)
            this.setState({ Loading: false });
        });
    }

    Alert(msg, title) {
        Modal.info({
            title: title || "提示",
            content: msg
        });
    }

    SetMenuRightMap(res) {
        const list = [];
        if (res.chlidPermission) res.chlidPermission.forEach(d => this.GetMenuRightMap(d, list))
        return list;
    }

    GetMenuRightMap(node, list) {
        const { aliasName, ownState, chlidPermission } = node;
        var isRight = ownState === "01";
        if (isRight && aliasName === "权限配置" && chlidPermission && chlidPermission[0].aliasName === "配置权限") {
            this.RightConfig2.ToConfigPage = true;
            return;
        }
        const menu = { RightPropertyNames: [] };
        if (isRight && this.Menus2[aliasName]) {
            menu.Key = this.Menus2[aliasName];
            if (node.chlidPermission && node.chlidPermission.length > 0) {
                if (!node.chlidPermission[0].chlidPermission) {
                    menu.RightPropertyNames = [];
                    node.chlidPermission.forEach(d => {
                        isRight = d.ownState === "01";
                        if (isRight && d.aliasName === "配置角色") this.RightConfig2.ToRoleConfig = true;
                        else isRight && menu.RightPropertyNames.push(d.aliasName);

                        if (isRight && aliasName === "进件详情" && d.aliasName === "保存") this.RightConfig2.EditOrder = true;

                        if (isRight && aliasName === "进件详情" && d.aliasName === "提交进件") this.RightConfig2.LookOrderDetail = true;
                    });
                }
                else {
                    node.chlidPermission.forEach(d => {
                        this.GetMenuRightMap(d, list);
                    })
                }
            }

            if (aliasName === "反欺诈审核") this.RightConfig2.LookApproveInfo = true;

            list.push(menu);
        }
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

        if (!this.QueryString.OrderCode) { this.OrderStatus = ""; this.TaskId = ""; this.IsNotOwnerTask = false };

        if (window.location.href !== this.PageUrl) {
            this.PageUrl = window.location.href;
            if (this.QueryString.OrderCode) this.GetOrderStatus();
        }

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

    GetNavMenuList() {
        if (this.IsSetRight) return;
        const { UserMenuRight } = this;

        UserMenuRight.forEach(m => { if (this.Menus[m.Key]) this.Menus[m.Key].IsRight = true; });

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
            this.Logout().then(res => router.push("/login"));
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
        if (!this.Token) router.push("/login");
        return !!this.Token
    }

    JudgeVisible(m) {
        if (m.Key === "OrderWorkManage" || m.Key === "ApprovalManage") {
            const { OrderCode } = this.QueryString
            if (Common.IsNullOrEmpty(OrderCode)) return false

            if (this.OrderStatus === "01" && m.Key === "ApprovalManage") return false;
        }
        return true;
    }

    IsMenuVisible(m) {
        if ((this.QueryString.LookCode || this.QueryString.SubmitId) && m.MenuName === "补件") return false;

        if (!this.OrderStatus) return true;
        const menuNames = RightConfig.OrderStatusNoMenus[this.OrderStatus];
        if (menuNames && menuNames.length > 0) {
            return menuNames.indexOf(m.MenuName) < 0;
        }
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
        return this.PostData("auth/logout", {}, "EmployeeApiService");
    }

    GetEmployeeInfo() {
        const loginUserInfo = Common.GetStorage("LoginUserInfo");
        if (loginUserInfo) return Promise.resolve(JSON.parse(loginUserInfo));

        return this.PostData("services/uaa/api/account", {}, "EmployeeApiService", "data");
    }

    GetUserMenuRight() {
        return this.PostData("useraccess/permission/queryPermissionTreeByUser", {}, "ApiService", "data");
    }

    GetOrderStatus() {
        var url = "workOrder/workOrderQuery/queryWorkOrderState";

        this.SyncPostData(url, { loanApplyId: this.QueryString.OrderCode }, "ApiService", (res) => {
            if (res.code === 0 && res.data.workOrderState) {
                this.OrderStatus = res.data.workOrderState;
                if (res.data.taskList && res.data.taskList.length > 0) {
                    const task = Common.ArrayFirst(res.data.taskList, f => Common.IsEquals(f.taskAssigneeId, this.UserId));
                    if (task !== null) this.TaskId = task.taskId;
                    else this.IsNotOwnerTask = true; //非自己任务
                }
            }
            else {
                const msg = res.Message || res.message || "请求异常";
                alert("获取工单状态异常：" + msg + ",请刷新再试！");
            };
        })
    }

    SyncPostData(url, data, serviceName, callback) {
        const headers = { clientId: "XXD_FRONT_END", clientTime: new Date().getTime(), token: this.Token }
        url = EnvConfig.GetServiceUrl(serviceName)() + url;
        url = Common.AddUrlRandom(url)
        AjaxRequest.PostRequest(url, headers, data, callback, false)
    }

    PostData(url, data, serviceName, resKey) {
        const headers = { clientId: "XXD_FRONT_END", clientTime: new Date().getTime(), token: this.Token }
        url = EnvConfig.GetServiceUrl(serviceName)() + url;
        url = Common.AddUrlRandom(url)
        return AjaxRequest.PromisePost(url, headers, data).then(d => HttpResponse.GetResponse(d, resKey), res => HttpResponse.GetErrorResponse(res));;
    }

    ToUserBasePage() {
        window.setTimeout(() => router.push("/PersonCenter/BaseInfo"), 100);
        return null;
    }

    render() {
        if (!this.Token) return null;

        if (this.state.Loading) return <div className="SpinDiv"><Spin tip="加载中……" /></div>

        const EmployeeInfo = this.GetPropsValue("EmployeeInfo", {});

        const UserMenuRight = this.GetPropsValue("UserMenuRight", null);

        if (!EmployeeInfo.realname || !UserMenuRight) return this.ToUserBasePage();

        const { Header, Sider, Content } = Layout;

        const selectedKeys = this.GetCurrentMenuSelectedKeys();

        if (!this.IsRight) return this.ToUserBasePage();

        const pageName = selectedKeys.length > 0 ? selectedKeys[0] : "";

        const loginName = EmployeeInfo.realname;

        this.PageData.GetEmployeeInfo = EmployeeInfo;
        this.PageData.GetUserMenuRight = UserMenuRight;
        this.PageData.OrderStatus = this.IsNotOwnerTask ? "" : this.OrderStatus;
        this.PageData.TaskId = this.TaskId;
        this.props.location.PageData = this.PageData;

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