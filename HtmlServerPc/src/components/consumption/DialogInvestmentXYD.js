import React from "react";
import { Common, Md5 } from "UtilsCommon";
import { BaseIndex, Dialog } from "ReactCommon";

export default class DialogInvestmentXYD extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = { IsVisible: false, errorTip: "", IsWaiting: false, IsInvestFial: true, IsLoginFail: false, IsSetPassword: false, InvestBids: {}, riskChecked: true, verifyUrl: "/userCenter/kaptcha.jpg", password: "", verifyCode: "" };

        this.InvestDisabled = false;
    }

    componentWillMount() {
        this.props.Page.InitPropsChanged(this.PropsChanged());
    }

    PropsChanged() {
        return (props, nextProps) => {
            if (this.JudgeChanged(props, nextProps, "PayPwdByTokenWithValidate")) this.ReceivePayPwdByTokenWithValidate(nextProps.PayPwdByTokenWithValidate);
            if (this.JudgeChanged(props, nextProps, "InvestOrder")) this.ReceiveInvestOrder(nextProps.InvestOrder);
        }
    }

    Show(InvestBids) {
        this.setState({ IsVisible: true, InvestBids });
    }

    Close() {
        this.setState({ IsVisible: false });
    }

    Refresh() {
        this.setState({ verifyUrl: this.GetVerifyUrl() })
    }

    PasswordVerify() {
        const { password, verifyCode } = this.state;

        const payload = { Token: this.props.Page.Token, data: { picCode: verifyCode, payPassword: Md5(password) } };

        this.props.Page.Dispatch("UserCenterService", "ValidatePayPwdByTokenWithValidate", payload);
    }

    GetVerifyUrl() {
        return '/userCenter/kaptcha.jpg?' + new Date().getTime();
    }

    ReceivePayPwdByTokenWithValidate(data) {
        this.InvestDisabled = false;
        if (!this.IsSuccessNextsProps(data)) {
            if (data.Code >= '200300' && data.Code < '200400') this.setState({ IsLoginFail: true })
            else this.setState({ errorTip: "支付失败，请刷新重试!", verifyUrl: this.GetVerifyUrl() });
            return
        };

        if (data.code === -4) { this.setState({ errorTip: "验证码错误，请重新输入!", verifyUrl: this.GetVerifyUrl() }); return }
        if (data.code == -5) { this.setState({ IsSetPassword: true }); return; }

        if (data.code === 0) {
            this.setState({ errorTip: "", IsWaiting: true });
            this.InvestOrder();
        }
        else this.setState({ errorTip: data.message, verifyUrl: this.GetVerifyUrl() });
    }

    InvestPurchase() {
        if (this.InvestDisabled) return;
        if (!this.state.riskChecked) { this.setState({ errorTip: "请勾选同意资金出借风险提示函" }); return }

        const { password, verifyCode } = this.state;

        let errorTip = ""
        if (Common.IsNullOrEmpty(password)) errorTip = "请输入支付密码！";
        else if (Common.IsNullOrEmpty(verifyCode)) errorTip = "请输入图片验证码！";

        this.setState({ errorTip: errorTip });
        if (!Common.IsNullOrEmpty(errorTip)) return;

        this.InvestDisabled = true;
        this.PasswordVerify();
    }

    ReceiveInvestOrder(data) {
        if (!this.IsSuccessNextsProps(data)) { this.setState({ errorTip: "出借失败，请刷新重试!" }); return };

        if (data.bizStatus.code == "SUCCESS") {
            Common.SetCookie("tenderType", 20);
            Common.SetCookie("historyUrl", window.location.href);
            window.location.href = '/detail/purchaseSuccess.html';
        } else if (data.bizStatus.message === '应监管需要，您需要先开通银行存管账户才能顺利出借哦~') window.location.href = '/detail/investFail.html';
        else this.setState({ errorTip: data.bizStatus.message, IsWaiting: false, IsInvestFial: true });
    }

    InvestOrder() {
        const { bidCode, investMoney } = this.state;
        const invest = {
            productCategory: 1,
            productId: bidCode,
            productType: 20,
            redEnvelopeCode: '',
            tenderAmount: investMoney
        }

        this.InvestDisabled = true;

        const payload = { Token: this.props.Page.Token, data: invest };
        this.props.Page.Dispatch("TradeCenterService", "InvestOrder", payload);
    }

    InvestKeypress(e) {
        var key = window.event ? e.keyCode : e.which;
        if (key === 13) this.InvestPurchase();
    }

    render() {
        const { IsVisible, InvestBids, errorTip, riskChecked, IsLoginFail, IsSetPassword, IsWaiting, IsInvestFial } = this.state;
        if (!IsVisible) return null;

        return (
            <Dialog IsVisible={IsVisible}>
                <div className='dimension'>
                    <i className='c_close' onClick={this.Close.bind(this)}>×</i>
                    <h5>确认投标</h5>
                    <div className='investment-focus'>
                        <span className='headline'>{"借款标题：" + InvestBids.bidName}</span><span >借款编号：<em className='serial-number'>{InvestBids.bidCode}</em></span>
                        <span>投标金额：<i>{Common.ToCurrency(InvestBids.investMoney)}</i>元</span><span className='expect-income'>年化收益：<em>{InvestBids.plannedAnnualRate + "%"}</em></span>
                        <span>投标奖励：<em>无</em></span><span>还款期限：<em>{InvestBids.leastPeriod + "个月"}</em></span>
                        <span className='act-pay'>实际支付：<i className='actualPayment'>{Common.ToCurrency(InvestBids.actualPayment)} </i>元</span><span>预计到期本息：<i>{Common.ToCurrency(InvestBids.allIncome)}</i>元</span>
                        <p className='password-box'>支付密码：
                        <input type='password' placeholder='请输入支付密码' className='password' onChange={this.InputChange("password")} maxLength={50} /><a href='/user/iforgetpaypassword.html' target='_blank'>忘记密码？</a></p>
                        <p className='verification-tip'>图片验证码：
                        <input type='text' placeholder='请输入图片验证码' className='verification-code' onChange={this.InputChange("verifyCode")} maxLength={50} /></p>
                        <div className='verification-box clearfix'>
                            <img src='/userCenter/kaptcha.jpg' alt='' className='verifyUrl' onClick={this.Refresh.bind(this)} /><a onClick={this.Refresh.bind(this)} className='refresh'><i></i></a>
                        </div>
                        <div className='authorization'><input type='checkbox' checked={riskChecked} onChange={this.CheckboxChange("riskChecked")} />我已同意 <a href='/introduce/risknotice-agreement.jsp' target='_blank'>《新新贷资金出借风险提示函》</a></div>
                        {IsLoginFail
                            ? <p className="pop-error">登录失效，请点击重新&nbsp;<a href='/user/ilogin.html'>登录</a></p>
                            : IsSetPassword
                                ? <p className="pop-error">为了您的出借安全，请<a href='/personal/changepassword.html'>设置支付密码</a>后重新出借</p>
                                : <p className={"pop-error" + (errorTip ? "" : ' hide')} >{errorTip}</p>}
                        <a className={IsWaiting ? 'btn waiting' : "btn"} onKeyPress={this.InvestKeypress.bind(this)} onClick={this.InvestPurchase.bind(this)}>{IsWaiting ? "出借中，请稍等..." : IsInvestFial ? "确认出错" : "确认投标"}</a>
                    </div>
                </div>
            </Dialog>
        )
    }
}