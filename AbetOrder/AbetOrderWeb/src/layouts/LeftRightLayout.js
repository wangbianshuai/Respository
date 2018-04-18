import React, { Component } from "react"
import * as Common from "../utils/Common"
import { Layout, Menu, Icon, Form, Dropdown, Avatar, Modal, Input, message } from 'antd';
import styles from "../styles/LeftRightLayout.css"
import { Link } from "dva/router";
import * as Request from "../utils/Request"
import ComputeMd5 from "../utils/Md5";
import SwitchRoute from "./SwitchRoute"

export default class LeftRightLayout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collapsed: false,
            Name: "Abet Order",
            IsChangePassword: false,
            OldPassword: "",
            NewPassword: "",
            AgainPassword: ""
        };
    }

    componentWillMount() {
        this.CurrentUser = Common.JsonParse(Common.GetStorage("LoginUserInfo")) || {};

        this.MenuList = [];

        if (this.CurrentUser.DataRight === 1) {
            this.MenuList = [
                this.AddMenu("订单列表", "table", "OrderList"),
                this.AddMenu("订单编辑", "form", "OrderEdit"),
                this.AddMenu("业务往来", "table", "DealingsBill"),
                this.AddMenu("收支明细", "table", "Bill"),
                this.AddMenu("客户", "table", "Customer"),
                this.AddMenu("往来类型", "table", "DealingsBillType"),
                this.AddMenu("账目类型", "table", "BillType"),
                this.AddMenu("个人账目", "table", "PersonBill"),
                this.AddMenu("订单PDF日志", "table", "OrderPdf")
            ]
        }
        else if (this.CurrentUser.DataRight === 2) {
            this.MenuList = [
                this.AddMenu("加工订单", "table", "ProcessOrderList"),
                this.AddMenu("业务往来", "table", "DealingsBill"),
                this.AddMenu("往来类型", "table", "DealingsBillType"),
                this.AddMenu("个人账目", "table", "PersonBill")
            ]

        }
        else if (this.CurrentUser.DataRight === 3) {
            this.MenuList = [
                this.AddMenu("订单列表", "table", "OrderList"),
                this.AddMenu("订单编辑", "form", "OrderEdit"),
                this.AddMenu("加工订单", "table", "ProcessOrderList"),
                this.AddMenu("业务往来", "table", "DealingsBill"),
                this.AddMenu("收支明细", "table", "Bill"),
                this.AddMenu("客户", "table", "Customer"),
                this.AddMenu("账目类型", "table", "BillType"),
                this.AddMenu("往来类型", "table", "DealingsBillType"),
                this.AddMenu("个人账目", "table", "PersonBill"),
                this.AddMenu("用户", "table", "User"),
                this.AddMenu("工厂", "table", "Factory"),
                this.AddMenu("往来账本", "table", "DealingsBook"),
                this.AddMenu("加工选项", "table", "ProcessItem"),
                this.AddMenu("备注选项", "table", "RemarkItem"),
                this.AddMenu("订单模板", "table", "TemplateHtml"),
                this.AddMenu("内容标签", "table", "ContentTag"),
                this.AddMenu("订单PDF日志", "table", "OrderPdf")
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

    ChangeLoginPassword(e) {
        let data = {
            OldPassword: this.state.OldPassword,
            NewPassword: this.state.NewPassword,
            AgainPassword: this.state.AgainPassword
        };

        let blSucceed = true, msg = "";

        if (Common.IsNullOrEmpty(data.OldPassword)) { blSucceed = false; msg = "原密码为不能空"; }
        if (blSucceed && Common.IsNullOrEmpty(data.NewPassword)) { blSucceed = false; msg = "新密码为不能空"; }

        if (blSucceed && data.NewPassword !== data.AgainPassword) {
            msg = "新密码与确认新密码不一致！"
            blSucceed = false
        }
        if (blSucceed && data.NewPassword === data.OldPassword) {
            msg = "新密码与原密码一致！"
            blSucceed = false
        }
        if (!blSucceed) {
            this.ShowMessage(msg)
            return false
        }

        const url = "User/ChangePassword";
        data = { User: { NewPassword: ComputeMd5(data.NewPassword), OldPassword: ComputeMd5(data.OldPassword) } };

        Request.Post(url, data).then(res => {
            if (res.IsSuccess === false) this.ShowMessage(res.Message);
            else {
                message.success("修改成功！", 1.5, () => this.CloseModal());
            }
        });
    }

    ShowMessage(msg) {
        message.warning(msg, 3)
    }

    ShowSuccess(msg) {
        message.success(msg, 3);
    }

    SelectMenuClick(item) {
        item.key === "ChangePassword" && this.setState({ IsChangePassword: true });
    }

    RenderUserRightMenuList() {
        return (<Menu selectedKeys={[]} className={styles.UserRightMenu} onClick={this.SelectMenuClick.bind(this)}>
            <Menu.Item key="ChangePassword" className={styles.UserRightMenuItem} ><Icon type="setting" /><span>修改密码</span></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" className={styles.UserRightMenuItem}><Link to="/Login"><Icon type="logout" /><span>退出登录</span></Link></Menu.Item>
        </Menu>)
    }

    CloseModal() {
        this.setState({ IsChangePassword: false });
    }

    OnChange(name, e) {
        const data = {};
        data[name] = e.target.value;
        this.setState(data)
    }

    render() {
        const { Header, Sider, Content } = Layout;

        const selectedKeys = this.GetCurrentMenuSelectedKeys();

        const pageName = selectedKeys.length > 0 ? selectedKeys[0] : "";

        return (<Layout style={{ minHeight: "100%" }}>
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
                                {
                                    Common.IsEquals(m.PageName, pageName, true) ?
                                        <div>
                                            <Icon type={m.IconType} />
                                            <span>{m.MenuName}</span>
                                        </div> :
                                        <Link to={"/" + m.PageName}>
                                            <Icon type={m.IconType} />
                                            <span>{m.MenuName}</span>
                                        </Link>
                                }
                            </Menu.Item>
                        ))
                    }
                </Menu>
                <div style={{ height: 30 }}></div>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0, margin: 0 }}>
                    <Icon
                        className={styles.trigger}
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    {this.CurrentUser.LoginName ? (
                        <Dropdown overlay={this.RenderUserRightMenuList()} >
                            <span className={styles.Dropdown}>
                                <Avatar size="small" src={require("../assets/UserAvatar.png")} className={styles.avatar} />
                                {this.CurrentUser.LoginName}
                            </span>
                        </Dropdown>
                    ) : null}
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 450 }}>
                    <SwitchRoute MenuList={this.MenuList} App={this.props.App} PageName={pageName} href={window.location.href} />
                </Content>
                <Modal
                    title="修改登录密码"
                    visible={this.state.IsChangePassword}
                    onOk={this.ChangeLoginPassword.bind(this)}
                    onCancel={this.CloseModal.bind(this)}
                >
                    <Form.Item
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        required={true}
                        label="原密码"
                    >
                        <Input placeholder="请输入原密码" type="password" onChange={this.OnChange.bind(this, "OldPassword")} value={this.state.OldPassword} />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        required={true}
                        label="新密码"
                    >
                        <Input placeholder="请输入新密码" type="password" onChange={this.OnChange.bind(this, "NewPassword")} value={this.state.NewPassword} />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        required={true}
                        label="确认新密码"
                    >
                        <Input placeholder="请再次输入新密码" type="password" onChange={this.OnChange.bind(this, "AgainPassword")} value={this.state.AgainPassword} />
                    </Form.Item>
                </Modal>
            </Layout>
        </Layout>)
    }
}