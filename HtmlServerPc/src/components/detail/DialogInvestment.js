import React from "react";
import { Common, Md5 } from "UtilsCommon";
import { BaseIndex, Dialog } from "ReactCommon";

export default class DialogInvestment extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = { IsVisible: false, errorTip: "", SelectCoupon: "0", IsWaiting: false, IsInvestFial: true, IsLoginFail: false, IsSetPassword: false, InvestProduct: {}, riskChecked: true, verifyUrl: "/userCenter/kaptcha.jpg", password: "", verifyCode: "" };

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

    Show(InvestProduct) {
        this.setState({ IsVisible: true, InvestProduct });
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

        const { InvestProduct } = this.state;

        if (data.bizStatus.code == "SUCCESS") {
            Common.SetCookie("startDate", data.startDate);
            Common.SetCookie("expireDate", data.expireDate);
            Common.SetCookie("tenderType", InvestProduct.TenderType);

            window.location.href = '/detail/purchaseSuccess.html';
        } else if (data.bizStatus.message === '应监管需要，您需要先开通银行存管账户才能顺利出借哦~') window.location.href = '/detail/investFail.html';
        else this.setState({ errorTip: data.bizStatus.message, IsWaiting: false, IsInvestFial: true });
    }

    InvestOrder() {
        const { InvestProduct, SelectCoupon } = this.state;

        const invest = {
            productCategory: 0,
            productId: InvestProduct.id,
            productType: 20,
            redEnvelopeCode: SelectCoupon,
            tenderAmount: InvestProduct.val
        }

        this.InvestDisabled = true;

        const payload = { Token: this.props.Page.Token, data: invest };
        this.props.Page.Dispatch("TradeCenterService", "InvestOrder", payload);
    }

    InvestKeypress(e) {
        var key = window.event ? e.keyCode : e.which;
        if (key === 13) this.InvestPurchase();
    }

    SelectCouponChange(e) {
        this.setState({ SelectCoupon: e.target.value });
    }

    render() {
        const { IsVisible, InvestProduct, errorTip, riskChecked, IsLoginFail, SelectCoupon, IsSetPassword, IsWaiting, IsInvestFial, RedenvelopeRecord } = this.state;
        if (!IsVisible) return null;

        return (
            <Dialog IsVisible={IsVisible}>

                <div class='dimension'>
                    <i className='c_close' onClick={this.Close.bind(this)}>×</i>
                    <h5>确认出借</h5>
                    <div class='investment-focus'>
                        <span>产品名称： {InvestProduct.name} </span>
                        <span class='past-earnings'>历史年化收益：<em class='past-returns'>{InvestProduct.apr}</em>%
                <b class='J_floatApr past-floatApr'>{InvestProduct.floatApr}%<i></i></b></span>
                        <span>出借金额：<i> {Common.ToCurrency(InvestProduct.val)} + "元</i></span><span class='expect-income'>历史收益：<i> Common.ToCurrency(InvestProduct.income) + "元</i></span>
                        <p class='act-pay'>实际支付：<i class='actualPayment'> Common.ToCurrency(InvestProduct.actualPayment) + </i>元</p>
                        <div class='discount'>
                            <p className='discount-tip'>优惠抵扣：</p>
                            <select name='' className='discount-coupon' value={SelectCoupon} onChange={this.SelectCouponChange.bind(this)}>
                                <option value='0'>-无优惠抵用券-</option>
                                {RedenvelopeRecord && RedenvelopeRecord.length > 0 && RedenvelopeRecord.map(m => <option value={m.faceValue}> {m.name} </option>)}
                            </select>
                        </div>
                        <p className='password-box'>支付密码：
                        <input type='password' placeholder='请输入支付密码' className='password' onChange={this.InputChange("password")} maxLength={50} /><a href='/user/iforgetpaypassword.html' target='_blank'>忘记密码？</a></p>
                        <p className='verification-tip'>图片验证码：
                        <input type='text' placeholder='请输入图片验证码' className='verification-code' onChange={this.InputChange("verifyCode")} maxLength={50} /></p>
                        <div className='verification-box clearfix'>
                            <img src='/userCenter/kaptcha.jpg' alt='' className='verifyUrl' onClick={this.Refresh.bind(this)} /><a onClick={this.Refresh.bind(this)} className='refresh'><i></i></a>
                        </div>
                        <p>资金由存管银行全程监控</p>
                        <div className='authorization'><input type='checkbox' checked={riskChecked} onChange={this.CheckboxChange("riskChecked")} />
                            我已同意<a href='/borrow/automaticMatchingProxy.html' target='_blank'>《自动配标委托书》</a>
                            <a href={InvestProduct.url} target='_blank'>《{InvestProduct.agreement}服务协议》</a>
                            <a href='/borrow/esignatureProxy.html' target='_blank'>《电子签名（章）授权委托书》</a>
                        </div>

                        {IsLoginFail
                            ? <p className="pop-error">登录失效，请点击重新&nbsp;<a href='/user/ilogin.html'>登录</a></p>
                            : IsSetPassword
                                ? <p className="pop-error">为了您的出借安全，请<a href='/personal/changepassword.html'>设置支付密码</a>后重新出借</p>
                                : <p className={"pop-error" + (errorTip ? "" : ' hide')} >{errorTip}</p>
                        }
                        <a className={IsWaiting ? 'btn waiting' : "btn"} onKeyPress={this.InvestKeypress.bind(this)} onClick={this.InvestPurchase.bind(this)}>{IsWaiting ? "出借中，请稍等..." : IsInvestFial ? "确认出错" : "确认投标"}</a>

                    </div>
                </div>
            </Dialog>
        )
    }
}