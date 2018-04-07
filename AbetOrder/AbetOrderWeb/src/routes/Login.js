import React, { Component } from 'react';
import { Form, Input, Button, Icon, message } from 'antd';
import styles from '../styles/Login.css';
import * as Request from "../utils/Request";
import ComputeMd5 from "../utils/Md5";
import * as Common from "../utils/Common"
import { routerRedux } from 'dva/router';
import { connect } from "dva";

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            IsLogining: false,
            LoginName: "",
            LoginPassword: ""
        }
    }

    componentWillMount() {
        Common.SetStorage("LoginUserInfo", "")
        Common.SetStorage("Token", "")
        Common.SetStorage("LoginUserId", "");
    }

    ShowMessage(msg) {
        message.warning(msg, 3)
    }

    OnChange(name, e) {
        const data = {};
        data[name] = e.target.value;
        this.setState(data)
    }

    OnLogin() {
        let data = {
            LoginName: this.state.LoginName,
            LoginPassword: this.state.LoginPassword
        };

        let blSucceed = true, msg = "";

        if (Common.IsNullOrEmpty(data.LoginName)) { blSucceed = false; msg = "登录名不能为空！"; }
        if (blSucceed && Common.IsNullOrEmpty(data.LoginPassword)) { blSucceed = false; msg = "密码不能为空！"; }

        if (!blSucceed) {
            this.ShowMessage(msg)
            return false
        }

        const url = "User/Login";
        data = { User: { LoginName: data.LoginName, LoginPassword: ComputeMd5(data.LoginPassword) } };

        this.setState({ IsLogining: true });

        Request.Post(url, data).then(res => {
            if (res.IsSuccess === false) { this.ShowMessage(res.Message); this.setState({ IsLogining: false }); }
            else {
                Common.SetStorage("Token", res.User.Token);
                Common.SetStorage("LoginUserId", res.User.UserId);
                Common.SetStorage("LoginUserInfo", JSON.stringify(res.User));
                this.props.ToPage("/OrderList");
            }
        }, res => this.ShowMessage(res.Message));
    }

    render() {
        return (
            <div className={styles.DivContainer}>
                <div className={styles.DivLogin}>
                    <Form.Item>
                        <div className={styles.DivHeader}><span>Abet Order</span></div>
                    </Form.Item>
                    <Form.Item>
                        <Input size="large" onPressEnter={this.OnLogin.bind(this)} prefix={<Icon type="user" className={styles.prefixIcon} />} placeholder="登录名" onChange={this.OnChange.bind(this, "LoginName")} value={this.state.LoginName} />
                    </Form.Item>
                    <Form.Item>
                        <Input size="large" onPressEnter={this.OnLogin.bind(this)} prefix={<Icon type="lock" className={styles.prefixIcon} />} type="password" placeholder="密码" onChange={this.OnChange.bind(this, "LoginPassword")} value={this.state.LoginPassword} />
                    </Form.Item>
                    <Form.Item>
                        <Button size="large" style={{ width: "100%" }} loading={this.state.IsLogining} type="primary" onClick={this.OnLogin.bind(this)}>登录</Button>
                    </Form.Item>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        ToPage(url) { dispatch(routerRedux.replace(url)); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)