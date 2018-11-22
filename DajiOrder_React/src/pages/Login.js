import React, { Component } from "react"
import { connect } from 'react-redux'
import * as Common from "../utils/Common"
import * as UserActions from "../actions/User"

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            LoginName: "",
            LoginPassword: "",
            LoginDisabled: false
        }
    }

    static get defaultProps() {
        return {

        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const ack = this.GetLoginAck(nextProps)

        if (ack && ack.IsSuccess) {
            this.props.ToPage("ProductList")
            return false
        }
        else if (ack && !ack.IsSuccess) {
            alert(ack.Message)
        }

        return true
    }

    GetLoginAck(nextProps) {
        if (nextProps.LoginInfo !== null
            && (this.props.LoginInfo === null || nextProps.LoginInfo.Ack.Id !== this.props.LoginInfo.Ack.Id)) {
            return nextProps.LoginInfo.Ack
        }
        return null
    }

    componentWillUpdate(nextProps, nextState) {
        const ack = this.GetLoginAck(nextProps)

        if (ack && !ack.IsSuccess) {
            this.setState({
                LoginDisabled: false
            })
        }
    }

    ChangeValue(name, e) {
        let data = {}
        data[name] = e.target.value
        this.setState(data)
    }

    OnLogin() {
        if (Common.StringIsNullOrEmpty(this.state.LoginName)) {
            alert("对不起，登录名不能为空！")
            this.refs.LoginName.focus()
            return
        }
        if (Common.StringIsNullOrEmpty(this.state.LoginPassword)) {
            alert("对不起，登录密码不能为空！")
            this.refs.LoginPassword.focus()
            return
        }

        this.setState({
            LoginDisabled: true
        })

        this.props.UserLogin(this.state.LoginName, this.state.LoginPassword)
    }

    render() {
        return (
            <div>
                <div>用户名：<input type="text" ref="LoginName" value={this.state.LoginName} onChange={this.ChangeValue.bind(this, "LoginName")} /></div>
                <div>密码：<input type="password" ref="LoginPassword" value={this.state.LoginPassword} onChange={this.ChangeValue.bind(this, "LoginPassword")} /></div>
                <div><input type="button" disabled={this.state.LoginDisabled} value="登录" onClick={this.OnLogin.bind(this)} /></div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        LoginInfo: state.User.LoginInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UserLogin(loginName, loginPassword) {
            return dispatch(UserActions.UserLogin(loginName, loginPassword))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
