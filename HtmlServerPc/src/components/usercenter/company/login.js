import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import MiniFooter from "../../common/mini-footer";

class Login extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle(){
        return "登录-新新贷"
    }

    GetCssList() {
        return ["/build/mods/company/login/_.css"];
    }

    GetJsList() {
        return ["/build/mods/company/login/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetCompanyLogin");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData, global, username } = this.props.PageData;

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} IsCompany={true} IsCompanyActive={false} />

                <div className="container">
                    <div className="regtips clearfix">
                        <p className="detail">
                            还没有账号？<a href="/usercenter/company/register.html" className="right-blue">立即注册</a>
                        </p>
                    </div>
                    <div className="account-box">
                        <div className="layout clearfix">
                            <div className="account-left">
                                <img src={PcBuildUrl + 'img/login_banner.png'} alt="" />
                            </div>

                            <div className="account-right">
                                <form id="form">
                                    <div className="error-tips tips-border" id="tipsBorder" style='visibility: hidden;'>
                                        <span id="errorTips"></span>
                                        <button id="closeBtn" className="close"></button>
                                    </div>
                                    <div className="username  userinfo clearfix">
                                        <input type="text" name="username" value={username} autocomplete="off" className="user" placeholder="请输入手机号／邮箱／用户名" id="username" />
                                    </div>
                                    <div className="userpsw userinfo">
                                        <input type="password" name="userpsw" placeholder="请输入登录密码" id="userpsw" className="psw" />
                                    </div>
                                    <div className="yzm clearfix">
                                        <input type="text" name="yzm" className="verifyCode" placeholder="请输入验证码" id="verifyCode" maxlength="4" autocomplete="off" />
                                        <div className="getVerify">
                                            <div className="getLayout clearfix">
                                                <img src="/userCenter/kaptcha.jpg" className="verifyurl" id="verifyUrl" />
                                                <div className="resetVerify" id="resetVerify">
                                                    <img src={PcBuildUrl + 'img/refresh.png'} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="login_remb clearfix">
                                        <input type="checkbox" id="remember" name="remember" /><span>
                                            记住登录名</span>
                                        <a href="/user/iforgetpassword.html" className="forgot-psw">忘记密码？</a>
                                    </div>
                                    <div className="login-submit clearfix">
                                        <button id="submit">立即登录</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <MiniFooter />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.CompanyLogin
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Login);