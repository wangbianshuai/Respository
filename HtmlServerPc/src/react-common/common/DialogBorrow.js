import React from "react";
import BaseIndex2 from "../BaseIndex2";
import Dialog from "../dialog/Index";
import { Common } from "UtilsCommon";

export default class Index extends BaseIndex2 {
    constructor(props) {
        super(props);

        this.state = { IsVisible: false };
    }

    Show() {
        this.setState({ IsVisible: true });
    }

    Close() {
        this.setState({ IsVisible: false });
    }

    GoRegister() {
        Common.RemoveCooke("Token");

        this.props.Page.Dispatch("UserService", "Logout");

        window.location.href = '/usercenter/company/register.html';
    }

    render() {
        const { IsVisible } = this.state;
        if (!IsVisible) return null;

        return (
            <Dialog IsVisible={IsVisible}>
                <div className='dialog-borrow'>
                    <div className='content-tips'><i className='close' onClick={this.Close.bind(this)}></i><h4>提示</h4>
                        <p>请重新申请企业用户</p>
                        <div className='go-to'>
                            <button onClick={this.GoRegister.bind(this)}>前往注册</button></div>
                    </div>
                </div>
            </Dialog>
        )
    }
}