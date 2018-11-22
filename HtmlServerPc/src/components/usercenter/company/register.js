import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import MiniFooter from "../../common/mini-footer";

class Register extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "注册-新新贷";
    }

    GetCssList() {
        return ["/build/mods/company/register/_.css"];
    }

    GetJsList() {
        return ["/build/mods/company/register/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetCompanyRegister");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData, isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB } = this.props.PageData;
        const MenuStatus = { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB }

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} IsCompany={true} IsCompanyActive={false} />


                <div className="container">
                    <div className="regtips clearfix">
                        <p className="detail">
                            已有账号？<a href="/usercenter/company/login.html" className="right-blue">立即登录</a>
                        </p>
                    </div>

                    <div className="account-box register-account " id="J_stepFirst">
                        <div className="layout clearfix">
                            <div className="register-left">
                                <img src={PcBuildUrl + 'img/register_banner1.png'} />
                            </div>
                            <div className="register-right">
                                <div className="reright-top">
                                    <ul className="clearafter">
                                        <li><i className="bluecolor">账户信息</i><span className="bgt-deblue"></span></li>
                                        <li className="second"><i>验证手机</i><span className="second"></span></li>
                                        <li className="last">注册成功</li>
                                    </ul>
                                </div>
                                <div className="user-name user-common tips-common">
                                    <div className="error-tips tips-border hidden" id="J_nameTiperror">
                                        <span>请输入企业名称</span>
                                        <button className="close"></button>
                                    </div>
                                    <div className="username" id="J_nameBorder">
                                        <span className="imgicon imgname"><img src={PcBuildUrl + 'img/reg_company.png'} /></span>
                                        <input id="userName" className="user-company" type="text" placeholder="请输入企业名称" name="userName" maxlength="100" />
                                    </div>
                                    <i className="tipright hidden" id="J_nameTipRight"></i>
                                </div>
                                <div className="user-phone user-common tips-common">
                                    <div className="error-tips tips-border hidden" id="J_numTiperror">
                                        <span>请输入正确的手机号码</span>
                                        <button className="close"></button>
                                    </div>
                                    <div className="usernum" id="J_numBorder">
                                        <span className="imgicon imgphone"><img src={PcBuildUrl + 'img/reg_phone.png'} /></span>
                                        <input id="userNum" className="user-number" type="text" placeholder="请输入您的手机号码，用于接收验证码" name="phoneNo" maxlength="11" />
                                    </div>
                                    <i className="tipright hidden" id="J_numTipRight"></i>
                                </div>
                                <div className="user-password user-common tips-common">
                                    <div className="error-tips tips-border hidden" id="J_pswTiperror" >
                                        <span>请输入正确密码：6-16位数字，字母组合</span>
                                        <button className="close"></button>
                                    </div>
                                    <div className="userpsw" id="J_pswBorder">
                                        <span className="imgicon imgphone"><img src={PcBuildUrl + 'img/reg_lock.png'} /></span>
                                        <input id="userPsw" className="user-password" type="password" placeholder="请设置6-16位数字，字母组合密码" name="pswNum" maxlength="16" />
                                        <span id="J_pswEye" className="eye eye-open eye-close"></span>
                                    </div>
                                    <i className="tipright hidden" id="J_pswTipRight"></i>
                                </div>
                                <div className="yzm user-common tips-common clearfix">
                                    <div className="error-tips tips-border hidden" id="J_yzmTipError" >
                                        <span>请输入的验证码不正确</span>
                                        <button className="close"></button>
                                    </div>
                                    <div className="user-yzm" id="J_verifyBorder">
                                        <input type="text" name="yzm" className="verifyCode" placeholder="请输入验证码" id="verifyCode" maxlength="4" />
                                        <div className="getVerify">
                                            <div className="getLayout clearfix">
                                                <img src="/userCenter/kaptcha.jpg" title="验证码" className="verifyurl" id="verifyurl" />
                                                <div className="resetVerify" id="resetVerify"><img src={PcBuildUrl + 'img/refresh.png'} /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <i className="tipright hidden" id="J_yzmTipRight"></i>
                                </div>
                                <div className="step-next user-common">
                                    <button id="J_nextStep" className="operate-step">下一步</button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="account-box register-number disnone" id="J_stepSecond">
                        <div className="layout clearfix">
                            <div className="register-left">
                                <img src={PcBuildUrl + 'img/register_banner2.png'} />
                            </div>
                            <div className="register-right">
                                <div className="reright-top">
                                    <ul className="clearafter">
                                        <li><i className="bluecolor">账户信息</i><span className="bgt-deblue"></span></li>
                                        <li className="second bluecolor"><i>验证手机</i><span className="second"></span></li>
                                        <li className="last">注册成功</li>
                                    </ul>
                                </div>
                                <div className="user-phone user-common tips-common">
                                    <div className="error-tips tips-border hidden" id="J_stepNumError">
                                        <span>请输入正确的手机号码</span>
                                        <button className="close"></button>
                                    </div>
                                    <div className="usernum" id="J_stepUserNum">
                                        <span className="imgicon imgphone"><img src={PcBuildUrl + 'img/reg_phone.png'} /></span>
                                        <input id="J_userNum" className="user-number" type="text" placeholder="请输入您的手机号码，用于接收验证码" name="J_phoneNo" maxlength="11" />
                                    </div>
                                    <i className="tipright hidden" id="J_stepNumRight"></i>
                                </div>
                                <div className="yzm user-common tips-common phone-special disnone clearfix" id="J_verifyPart">
                                    <div className="error-tips tips-border hidden" id="J_stepYzmError" >
                                        <span>请输入的验证码不正确</span>
                                        <button id="J-closeBtn" className="close"></button>
                                    </div>
                                    <div className="user-yzm">
                                        <input type="text" name="yzm" className="verifyCode" placeholder="请输入验证码" id="J_verifyCode" maxlength="4" />
                                        <div className="getVerify">
                                            <div className="getLayout clearfix">
                                                <img src="/userCenter/kaptcha.jpg" title="验证码" className="verifyurl" id="J_verifyUrl" />
                                                <div className="resetVerify" id="J_resetVerify">
                                                    <img src={PcBuildUrl + 'img/refresh.png'} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <i className="tipright hidden" id="J_stepYzmRight"></i>
                                </div>
                                <div className="yzm user-common tips-common phone-special phone-yzm-special clearfix">
                                    <div className="error-tips tips-border disnone" id="J_stepYyError" >
                                        <span>请输入的验证码不正确</span>
                                        <button className="close"></button>
                                    </div>
                                    <a href="javascript:void(0);" className="get-voice-yzm disnone" id="J_getVoiceYzm">获取语音验证码</a>
                                    <div className="user-yzm phone-yzm clearfix">
                                        <input type="text" name="yzm" className="verifyCode" placeholder="请输入短信验证码" id="J_yyVerifyCode" maxlength="4" />
                                        <div className="getVerify">
                                            <div className="getLayout clearfix">
                                                <button className="msg-phone message_yzm" disabled id="J_StepSend">发送验证码到手机</button>
                                            </div>
                                        </div>
                                    </div>
                                    <i className="tipright phone-special-right hidden" id="J_stepYyRight"></i>
                                    <div className="send-msg hidden" id="J_sendSuccessTips">
                                        <i className="send-clur"></i><span>验证码已发送至您的手机，请查收</span>
                                    </div>
                                </div>
                                <button className="agree-register user-common" id="J_agreeRegister">同意注册</button>
                                <a href="/user/reg-agreement.html" className="user-common xxd-agreement" target="_blank">《新新贷注册服务协议》</a>
                                <a href="/user/regRiskWarning.html" className="user-common xxd-agreement xxd-top" target="_blank">《资金出借风险提示函》</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dialog-tips disnone" id="J_dialogTips">
                    <div className="content-tips">
                        <i id="J_close"></i>
                        <h4>提示</h4>
                        <p id="J_tipsMsg">充值成功 !</p>
                        <button className="tips-btn" id="J_tipsBtn">确认</button>
                    </div>
                </div>

                <MiniFooter />

                <input id="BUSICODE_REGISTER" value="BUSICODE_REGISTER" type="hidden" />
                <input id="uuid" name="uuid" value="" type="hidden" />
                <input id="register" value="register" type="hidden" />
                <input id="regFrom" value="" type="hidden" />

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.CompanyRegister
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Register);