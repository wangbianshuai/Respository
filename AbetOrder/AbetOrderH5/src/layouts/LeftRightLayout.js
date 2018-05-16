import React, { Component } from "react"
import * as Common from "../utils/Common"
import { Modal, Flex, InputItem, Toast } from 'antd-mobile';
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
                this.AddMenu("个人账目", "table", "PersonBill")
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
                this.AddMenu("操作日志", "table", "OperationLog")
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
                Toast.success("修改成功！", 1.5, () => this.CloseModal());
            }
        });
    }

    ShowMessage(msg) {
        Toast.warning(msg, 3)
    }

    ShowSuccess(msg) {
        Toast.success(msg, 3);
    }

    SelectMenuClick(item) {
        item.key === "ChangePassword" && this.setState({ IsChangePassword: true });
    }

    RenderUserRightMenuList() {
        return (<Flex selectedKeys={[]} className={styles.UserRightMenu} onClick={this.SelectMenuClick.bind(this)}>
            <Flex key="ChangePassword" className={styles.UserRightMenuItem} ><Flex type="setting" /><span>修改密码</span></Flex>
            <Flex />
            <Flex key="logout" className={styles.UserRightMenuItem}><Link to="/Login"><Flex type="logout" /><span>退出登录</span></Link></Flex>
        </Flex>)
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
        const selectedKeys = this.GetCurrentMenuSelectedKeys();

        const pageName = selectedKeys.length > 0 ? selectedKeys[0] : "";

        return (<Flex style={{ minHeight: "100%" }}>
            <Flex trigger={null}
                collapsible
                collapsed={this.state.collapsed}>
                <div className={styles.logo} >
                    <span>{this.state.Name}</span>
                </div>
                <Flex theme="dark" mode="inline" selectedKeys={selectedKeys}>
                    {
                        this.MenuList.map(m => (
                            <Flex key={m.PageName}>
                                {
                                    Common.IsEquals(m.PageName, pageName, true) ?
                                        <div>
                                            <Flex type={m.IconType} />
                                            <span>{m.MenuName}</span>
                                        </div> :
                                        <Link to={"/" + m.PageName}>
                                            <Flex type={m.IconType} />
                                            <span>{m.MenuName}</span>
                                        </Link>
                                }
                            </Flex>
                        ))
                    }
                </Flex>
                <div style={{ height: 30 }}></div>
            </Flex>
            <Flex>
                <Flex style={{ background: '#fff', padding: 0, margin: 0 }}>
                    <Flex
                        className={styles.trigger}
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    {this.CurrentUser.LoginName ? (
                        <Flex overlay={this.RenderUserRightMenuList()} >
                            <span className={styles.Dropdown}>
                                <Flex size="small" src={require("../assets/UserAvatar.png")} className={styles.avatar} />
                                {this.CurrentUser.LoginName}
                            </span>
                        </Flex>
                    ) : null}
                </Flex>
                <Flex style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 450 }}>
                    <SwitchRoute MenuList={this.MenuList} App={this.props.App} PageName={pageName} href={window.location.href} />
                </Flex>
                <Modal
                    title="修改登录密码"
                    visible={this.state.IsChangePassword}
                    onOk={this.ChangeLoginPassword.bind(this)}
                    onCancel={this.CloseModal.bind(this)}
                >
                    <Flex
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        required={true}
                        label="原密码"
                    >
                        <InputItem placeholder="请输入原密码" type="password" onChange={this.OnChange.bind(this, "OldPassword")} value={this.state.OldPassword} />
                    </Flex>
                    <Flex
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        required={true}
                        label="新密码"
                    >
                        <InputItem placeholder="请输入新密码" type="password" onChange={this.OnChange.bind(this, "NewPassword")} value={this.state.NewPassword} />
                    </Flex>
                    <Flex
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 15 }}
                        required={true}
                        label="确认新密码"
                    >
                        <InputItem placeholder="请再次输入新密码" type="password" onChange={this.OnChange.bind(this, "AgainPassword")} value={this.state.AgainPassword} />
                    </Flex>
                </Modal>
            </Flex>
        </Flex>)
    }
}