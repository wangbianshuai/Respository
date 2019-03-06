import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";
import DialogRatherTest from "../consumption/DialogRatherTest";
import DialogNewNextTest from "../consumption/DialogNewNextTest";
import DialogNewTest from "../consumption/DialogNewTest";
import DialogInvestment from "./DialogInvestment";

export default class ThirtyTenderInvest extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = {
            investMoney: "",
            errorTip: "",
            riskChecked: false,
            income: 0,
            limitMoney: 0,
            IsEnable: false
        }

        this.ToBidsDisabled = false;
    }

    InitProperty(investProduct) {
        const { name, count, nextTestTime, quota, usable, typeName, surplusAmount, useRedenvelope, step, remAccount, lowestTender, investmentAmount, status, mostTender, meetTermOfPurchase, id } = investProduct || {}

        this.name = name
        this.quota = Common.GetFloatValue(quota);
        this.investmentAmount = Common.GetFloatValue(investmentAmount);
        this.surplusAmount = Common.GetFloatValue(surplusAmount);
        this.typeName = typeName;
        this.lastCount = count;
        this.nextTestTime = nextTestTime;
        this.status = status;
        this.mostTender = mostTender;
        this.meetTermOfPurchase = meetTermOfPurchase;
        this.useRedenvelope = useRedenvelope;
        this.productId = id;
        this.step = Common.GetFloatValue(step);
        this.usable = Common.GetFloatValue(usable);
        this.lowestTender = Common.GetFloatValue(lowestTender);
        this.remAccount = Common.GetFloatValue(remAccount);

        this.setState({ income: this.ComputeIncome(lowestTender), IsEnable: status === 2 && meetTermOfPurchase, limitMoney: mostTender, investMoney: this.lowestTender });
    }

    ReNewTest() {
        if (this.lastCount === 0) this.DialogRatherTestElement.Show(this.surplusAmount, this.nextTestTime);
        else window.location.href = '/usercenter/questionnaire.html?location=1';
    }

    componentWillMount() {
        this.props.Page.InitPropsChanged(this.PropsChanged());
        this.props.Page.SetBuyButton = (blEnd) => this.setState({ IsEnable: !blEnd });

        const { InvestProduct } = this.props;
        this.InitProperty(InvestProduct);

        this.props.Page.AddComponentList("Dialogs", [
            <DialogRatherTest key={Common.CreateGuid()} ref={(e) => this.DialogRatherTestElement = e} />,
            <DialogNewNextTest key={Common.CreateGuid()} ref={(e) => this.DialogNewNextTestElement = e} ReNewTest={this.ReNewTest.bind(this)} />,
            <DialogNewTest key={Common.CreateGuid()} ref={(e) => this.DialogNewTestElement = e} />,
            <DialogInvestment key={Common.CreateGuid()} ref={(e) => this.DialogInvestmentElement = e} Page={this.props.Page} />
        ]);
    }

    PropsChanged() {
        return (props, nextProps) => {
            if (this.JudgeChanged(props, nextProps, "HasComplete")) this.ReceiveHasComplete(nextProps.HasComplete);
            if (this.JudgeChanged(props, nextProps, "AuthorizedQuota")) this.ReceiveAuthorizedQuota(nextProps.AuthorizedQuota);
            if (this.JudgeChanged(props, nextProps, "RedenvelopeRecord")) this.ReceiveRedenvelopeRecord(nextProps.RedenvelopeRecord);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.JudgeChanged(this.props, nextProps, "InvestProduct")) this.ReceiveInvestProduct(nextProps.InvestProduct);
    }

    ReceiveInvestProduct(investProduct) {
        if (this.IsSuccessNextsProps(investProduct)) this.InitProperty(investProduct);
    }

    RenderBuyWrap() {
        const { IsLogin } = this.props;
        const { meetTermOfPurchase, investmentAmount, surplusAmount, status, quota, typeName, count, nextTestTime } = this.props.InvestProduct;

        if (!IsLogin) {
            const style = { margin: "10px 0 60px" }
            if (status === 1) return <div id="J_buyWrap"><a className='btn disable' style={style}>等待发售</a></div>;
            else if (status === 3 || status === 4) return <div id="J_buyWrap"><a href='#' id='J_buy' className='btn disable' style={style}>本场已结束</a></div>;
            else return null;
        }

        if (typeName == '保守型') {
            if (count === 0) {
                return (
                    <div id="J_buyWrap">
                        <p className="noAssessment">根据您的风险测评结果，您无法在平台进行出借！</p>
                        <p>{'您今年测试测评已达5次上线，' + Common.DateFormat(nextTestTime, "yyyy-MM-dd") + '后可重新开始测评。'}</p>
                    </div>
                )
            } else {
                return <div id="J_buyWrap"><p className="noAssessment">根据您的风险测评结果，您无法在平台进行出借！<a className="J_getNewTest" onClick={this.ReNewTest.bind(this)}>重新测评</a></p></div>;
            }
        }
        else if ((typeName == '') || (typeName == '进取型')) { }
        else {
            return (
                <div id="J_buyWrap">
                    <p className="red">{'您的平台剩余可投额度:' + Common.ToCurrency(surplusAmount) + '元'}</p>
                    <p className="test-tip">{'您在平台已加入' + Common.ToCurrency(investmentAmount) + '元，风险测评给予您的总限额为' + Common.ToCurrency(quota) + '元，可投剩余额度为' + Common.ToCurrency(surplusAmount) + '元'}</p>
                    {status == 2 && meetTermOfPurchase ?
                        <a className='btn fast-invest month-btn' onClick={this.ToBid.bind(this)}>立即加入</a>
                        : null}
                </div>
            );
        }
    }

    IsInvest() {
        return this.props.IsLogin && this.mostTender > 0 && this.state.IsEnable
    }

    InvestMoneyBlur(e) {
        if (!this.IsInvest()) return false;

        const { step, lowestTender, usable, mostTender } = this;

        let val = Common.GetNumber(this.state.investMoney);

        let errorTip = "", income = 0;

        if (val % step !== 0) errorTip = "输入金额不是以出借单位" + step + "的整数倍递增";
        else if (val > usable) errorTip = "账户余额不够！请先去充值";
        else if (val < lowestTender) errorTip = "您的出借额最低不能低于" + lowestTender + "元";
        else if (val > mostTender) errorTip = "您的出借额最大不能大于" + mostTender + "元";
        else income = this.ComputeIncome(val);

        const limitMoney = SetLimitMoney(mostTender, val);

        this.IsValidAmount = Common.IsNullOrEmpty(errorTip);

        this.setState({ income: income, limitMoney, investMoney: val, errorTip: errorTip });
    }

    ChangeInvestMoney(e) {
        if (!this.IsInvest()) return;

        var v = Common.GetFloatValue(e.target.value);
        if (v < 0) v = 0;

        this.setState({ investMoney: v });
    }

    JudgeQuestion() {
        const val = Common.GetFloatValue(this.state.investMoney);
        const { typeName, lastCount, nextTestTime, surplusAmount, usable } = this;

        if (typeName !== '进取型' && !Common.IsNullOrEmpty(lastCount)) {
            if (surplusAmount > usable && val > surplusAmount && surplusAmount > usable) {
                if (lastCount === 0) this.DialogRatherTestElement.Show(surplusAmount, nextTestTime);
                else this.DialogNewNextTestElement.Show(surplusAmount);
                return false;
            } else if (usable > surplusAmount && surplusAmount < val && val < usable) {
                if (lastCount === 0) this.DialogRatherTestElement.Show(surplusAmount, nextTestTime);
                else this.DialogNewNextTestElement.Show(surplusAmount);
                return false;
            }
        }

        return true;
    }

    ToBid() {
        if (!this.IsInvest() || this.ToBidsDisabled || !this.IsValidAmount) return;
        //增加资金出借风险提示函
        if (!this.state.riskChecked) { this.setState({ errorTip: "请确认您已知晓并接受上述风险" }); return }

        if (!this.JudgeQuestion()) return;

        this.props.Page.Dispatch("XxdService", "HasComplete", {});
        this.ToBidsDisabled = true;
        this.setState({ errorTip: "" });
    }

    ReceiveHasComplete(data) {
        this.ToBidsDisabled = false;
        if (data.resultCode === 1) { this.DialogNewTestElement.Show(); return }
        else if (data.resultCode === -1) { window.location.href = "/user/ilogin.html"; return }

        //红包请求
        if (this.useRedenvelope === 'Y') this.Redenvelope();
        else this.CheckAuthorizedQuota();
    }

    Redenvelope() {
        const val = Common.GetFloatValue(this.state.investMoney);
        const payload = { 'investmentAmount': val };

        this.props.Page.Dispatch("TradeCenterService", "RedenvelopeRecord", payload);
        this.ToBidsDisabled = true;
    }

    ReceiveRedenvelopeRecord(data) {
        this.ToBidsDisabled = false;
        if (!this.IsSuccessNextsProps(data)) return;

        this.CheckAuthorizedQuota();
    }

    CheckAuthorizedQuota() {
        this.ToBidsDisabled = true;
        const val = Common.GetFloatValue(this.state.investMoney);
        this.props.Page.Dispatch("TradeCenterService", "CheckAuthorizedQuota", { Url: `InvestOrder/checkAuthorizedQuota?tenderAmount=${val}`, Token: this.props.Page.Token });
    }

    ReceiveAuthorizedQuota(data) {
        this.ToBidsDisabled = false;
        if (!this.IsSuccessNextsProps(data)) return;

        const val = Common.GetFloatValue(this.state.investMoney);
        const { name, apr, id, floatApr } = this.props.InvestProduct;

        const income = this.ComputeIncome(val);

        this.DialogInvestmentElement.Show({
            name,
            apr,
            floatApr,
            val,
            id,
            income,
            actualPayment: val,
            TenderType: 93,
            RedenvelopeRecord: this.props.RedenvelopeRecord,
            url: '/commpd/agree/XSCP30T_agree_' + id + '.html?productSign=XSCP30T',
            agreement: '新元宝（新手专享）'
        });
    }

    ComputeIncome(mostTender) {
        const { period, periodUnit, apr, floatApr } = this.props.InvestProduct;

        if (!period) return 0;

        this.period = this.GetPeriod(period, periodUnit);
        this.apr = Common.GetFloatValue(apr) / 100;
        this.floatApr = Common.GetFloatValue(floatApr) / 100;

        return this.RateEarning(this.period, this.apr, this.floatApr, mostTender);
    }

    GetPeriod(period, periodUnit) {
        period = parseInt(period);
        if (periodUnit === 'MONTH') period *= 30;
        return period;
    }

    RateEarning(day, rate, floatApr, capital) {
        if (floatApr == 0) return Math.floor(rate * capital / 360 * day * 100) / 100;
        else {
            var apr = Math.floor(rate * capital / 360 * day * 100) / 100;
            var float = Math.floor(capital * floatApr / 360 * day * 100) / 100;
            var sum = (apr + float).toFixed(2);
            return sum;
        }
    }

    SelectMoney(amount, IsEnable) {
        if (!(this.mostTender > amount && IsEnable)) return;

        const limitMoney = SetLimitMoney(mostTender, val);

        this.setState({ income: this.ComputeIncome(amount), limitMoney, investMoney: amount });
    }

    MinusPlus(blMinus) {
        if (!this.IsInvest()) return false;

        const { step, remAccount, usable, lowestTender, mostTender } = this;
        let val = Common.GetFloatValue(this.state.investMoney);
        let income = this.state.income;

        if (blMinus && val > step) val = val - step;
        else if (!blMinus && val < remAccount) val = val + step;

        let errorTip = "";
        if (val >= remAccount) errorTip = "目前最大可加入金额为" + remAccount + "，不可再增加投入额";
        else if (val % step !== 0) errorTip = "输入金额不是以出借单位" + step + "的整数倍递增";
        else if (val > usable) errorTip = "账户余额不够！请先去充值";
        else if (val < lowestTender) {
            errorTip = "您的出借额最低不能低于" + lowestTender + "元";
            val = lowestTender;
        } else if (val > mostTender) {
            errorTip = "您的出借额最大不能大于" + mostTender + "元";
            val = mostTender;
        } else if (Common.GetFloatValue(this.state.investMoney) !== val) income = this.ComputeIncome(val);

        const limitMoney = SetLimitMoney(mostTender, val);

        this.IsValidAmount = Common.IsNullOrEmpty(errorTip);

        this.setState({ income: income, limitMoney, investMoney: val, errorTip: errorTip });
    }

    SetLimitMoney(mostTender, val) {
        let limitMoney = mostTender - val;
        if (limitMoney < 0) limitMoney = 0;

        return limitMoney;
    }

    render() {
        const { IsLogin, InvestProduct } = this.props;
        const { investMoney, errorTip, riskChecked, IsEnable, income } = this.state;
        const { meetTermOfPurchase, status } = InvestProduct;
        const isNoNew = status == 2 && !meetTermOfPurchase;

        return (
            <div className='detail-focus'>
                {!IsLogin && <p>账户余额：<a className='tologin'>登录</a>后可见</p>}
                {IsLogin && <p>
                    账户余额：{Common.ToCurrency(InvestProduct.usable)} <a
                        href='/usercenter/recharge.html' id="recharge">充值</a></p>}
                {IsLogin && isNoNew && <div className='J_noCondition'>
                    <div className='no-thirty-condition'>
                        <p>您已经不是新手用户了， 查看其他更多新元宝产品。</p>
                        <a href='/xplan/search/list.html'>去看看</a></div>
                </div>}
                {(!IsLogin || !isNoNew) && <div className='J_noCondition'>
                    <p>加入金额：（{InvestProduct.step}的整数倍递增）</p>
                    <div className='money' id="J_money">
                        <button type='button' value='500' onClick={this.SelectMoney(500, IsEnable)} className={InvestProduct.mostTender > 500 && IsEnable ? '' : 'disable'}>500元</button>
                        <button type='button' value='800' onClick={this.SelectMoney(800, IsEnable)} className={InvestProduct.mostTender > 800 && IsEnable ? '' : 'disable'}>800元</button>
                        <button type='button' value='1000' onClick={this.SelectMoney(1000, IsEnable)} className={InvestProduct.mostTender > 1000 && IsEnable ? '' : 'disable'}>1000元</button>
                        <button type='button' value='2000' onClick={this.SelectMoney(2000, IsEnable)} className={InvestProduct.mostTender > 2000 && IsEnable ? '' : 'disable'}>2000元</button>
                        <button type='button' value='3000' onClick={this.SelectMoney(3000, IsEnable)} className={InvestProduct.mostTender > 3000 && IsEnable ? '' : 'disable'}>3000元</button>
                        <button type='button' value='5000' onClick={this.SelectMoney(5000, IsEnable)} className={InvestProduct.mostTender > 5000 && IsEnable ? '' : 'disable'}>5000元</button>
                        <button type='button' value='8000' onClick={this.SelectMoney(8000, IsEnable)} className={InvestProduct.mostTender > 8000 && IsEnable ? '' : 'disable'}>8000元</button>
                        <button type='button' value='10000' onClick={this.SelectMoney(10000, IsEnable)} className={InvestProduct.mostTender > 10000 && IsEnable ? '' : 'disable'}>10000元</button>
                    </div>
                    <p className='number-box clearfix' id="J_numberBox">
                        <span xxd-sign="minus" className={IsEnable ? 'add-subtract' : 'disable focus-disable'} onClick={this.MinusPlus.bind(this, true)}>-</span>
                        <input type="text" maxLength={10} value={investMoney} onChange={this.ChangeInvestMoney.bind(this)} onBlur={this.InvestMoneyBlur.bind(this)} className={IsEnable ? '' : 'disable focus-disable'} disabled={!IsEnable} />
                        <span xxd-sign="plus" className={IsEnable ? 'add-subtract' : 'disable focus-disable'} onClick={this.MinusPlus.bind(this, false)}>+</span>
                    </p>
                    <p>历史收益：<span>{income}</span>元</p>
                    <p><i></i>资金由存管银行全程监控</p>
                    {IsLogin && IsEnable && <p className='risk-protocol'><input type="checkbox" onChange={this.CheckboxChange("riskChecked")} checked={riskChecked} />我已充分阅读本<a target='_blank' href="/user/regRiskWarning.html">《资金出借风险提示函》</a>，知晓包括债权转让风险在内的相关风险提示，并将根据风险承受能力谨慎出借并承担风险。</p>}
                    <p className={"error-tip" + (Common.IsNullOrEmpty(errorTip) ? ' hide' : "")}>{errorTip}</p>
                    {this.RenderBuyWrap()}
                </div>}
            </div>
        )
    }
}