import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";
import DialogRatherTest from "./DialogRatherTest";
import DialogNewNextTest from "./DialogNewNextTest";
import DialogNewTest from "./DialogNewTest";
import DialogInvestmentXYD from "./DialogInvestmentXYD";

export default class InvestBuy extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = {
            investMoney: "",
            earnings: "0.00",
            errorTip: "",
            riskChecked: false
        }

        this.ToBidsDisabled = false;
    }

    InitProperty(overview, bidsDetail, questionUser) {
        const { Page } = this.props;
        const { availableBalance, investmentAmount } = overview || {}
        const { bidName, tenderAmountUp, leftTenderAmount, tenderAmountDown, leastPeriodValue, plannedAnnualRate, bidAmount, repaymentType } = bidsDetail || {};
        const { count, nextTestTime, quota, typeName } = questionUser || {};

        this.availableBalance = availableBalance || 0; //账户余额
        this.bidCode = Page.BidCode;
        this.bidName = bidName;

        this.plannedAnnualRate = plannedAnnualRate || 0;
        this.tenderAmountDown = tenderAmountDown || 0; //最低要投
        this.tenderAmountUp = tenderAmountUp || 0; //最高可投
        this.leastPeriodValue = leastPeriodValue || 0;
        this.leftTenderAmount = leftTenderAmount || 0; //剩余可投
        this.bidAmount = bidAmount || 0;

        this.quota = Common.GetFloatValue(quota);
        this.investmentAmount = Common.GetFloatValue(investmentAmount);
        this.surplusAmount = this.quota - this.investmentAmount;

        this.typeName = typeName;
        this.lastCount = count;
        this.nextTestTime = nextTestTime;
        this.repaymentType = repaymentType;

        bidsDetail.percent = this.ComputePercent(bidsDetail);
    }

    ReNewTest() {
        if (this.lastCount === 0) this.DialogRatherTestElement.Show(this.surplusAmount, this.nextTestTime);
        else window.location.href = '/usercenter/questionnaire.html?location=1';
    }

    componentWillMount() {
        this.props.Page.InitPropsChanged(this.PropsChanged());

        const { Overview, BidsDetail, QuestionUser } = this.props;
        this.InitProperty(Overview, BidsDetail, QuestionUser);

        this.props.Page.AddComponentList("Dialogs", [
            <DialogRatherTest key={Common.CreateGuid()} ref={(e) => this.DialogRatherTestElement = e} />,
            <DialogNewNextTest key={Common.CreateGuid()} ref={(e) => this.DialogNewNextTestElement = e} ReNewTest={this.ReNewTest.bind(this)} />,
            <DialogNewTest key={Common.CreateGuid()} ref={(e) => this.DialogNewTestElement = e} />,
            <DialogInvestmentXYD key={Common.CreateGuid()} ref={(e) => this.DialogInvestmentXYDElement = e} Page={this.props.Page} />
        ]);
    }

    PropsChanged() {
        return (props, nextProps) => {
            if (this.JudgeChanged(props, nextProps, "HasComplete")) this.ReceiveHasComplete(nextProps.HasComplete);
            if (this.JudgeChanged(props, nextProps, "AuthorizedQuota")) this.ReceiveAuthorizedQuota(nextProps.AuthorizedQuota);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.JudgeChanged(this.props, nextProps, "BidsDetail")) this.ReceiveBidsDetail(nextProps.Overview, nextProps.BidsDetail, nextProps.QuestionUser);
        if (this.JudgeChanged(this.props, nextProps, "Overview")) this.ReceiveOverview(nextProps.Overview, nextProps.BidsDetail, nextProps.QuestionUser);
        if (this.JudgeChanged(this.props, nextProps, "QuestionUser")) this.ReceiveQuestionUser(nextProps.Overview, nextProps.BidsDetail, nextProps.QuestionUser);
    }

    ReceiveQuestionUser(overview, bidsDetail, questionUser) {
        if (this.IsSuccessNextsProps(questionUser)) this.InitProperty(overview, bidsDetail, questionUser);
    }

    ReceiveOverview(overview, bidsDetail, questionUser) {
        if (this.IsSuccessNextsProps(overview)) this.InitProperty(overview, bidsDetail, questionUser);
    }

    ReceiveBidsDetail(overview, bidsDetail, questionUser) {
        if (this.IsSuccessNextsProps(bidsDetail)) this.InitProperty(overview, bidsDetail, questionUser);
    }

    ComputePercent(bidsDetail) {
        if (!bidsDetail.bidAmount) return 0;

        // 计算已经投资所占百分比
        const bidAmount = Common.GetFloatValue(bidsDetail.bidAmount);
        if (bidAmount === 0) return 0;

        const leftTenderAmount = bidsDetail.leftTenderAmount;
        const d = (bidAmount - leftTenderAmount) / bidAmount * 100;

        return Common.GetIntValue(d);
    }

    RenderBuyWrap() {
        if (!this.props.IsLogin) return <div><a className='button' href='/user/ilogin.html'>立即登录</a></div>

        if (this.leftTenderAmount === 0) return <div><a className='button disable'>已抢光</a></div>
        else return <div><a className='button' onClick={this.OnClick("ToBid")}>立即加入</a></div>
    }

    OnClick(key) {
        return (e) => {
            if (key === "AllInvest") this.AllInvest();
            else if (key === "ToBid") this.ToBid();
        }
    }

    AllInvest() {
        if (!this.IsInvest()) return;

        const { tenderAmountUp, leftTenderAmount, availableBalance } = this;

        let investMoney = "";
        if (tenderAmountUp !== 0) {
            var least = tenderAmountUp < availableBalance ? tenderAmountUp : availableBalance;
            if (leftTenderAmount > least) investMoney = least;
            else investMoney = leftTenderAmount;
        } else {
            if (leftTenderAmount > availableBalance) investMoney = availableBalance;
            else investMoney = leftTenderAmount;
        }

        this.setState({ investMoney: investMoney });
    }

    IsInvest() {
        return this.props.IsLogin && this.leftTenderAmount > 0
    }

    OnBlur(key) {
        return (e) => {
            if (key === "investMoney") return this.InvestMoneyBlur(e);
        }
    }

    InvestMoneyBlur(e) {
        if (!this.IsInvest()) return false;

        const { availableBalance, tenderAmountUp, leftTenderAmount, tenderAmountDown, leastPeriodValue, plannedAnnualRate, bidAmount, repaymentType } = this;

        let val = Common.GetNumber(this.state.investMoney);

        let earnings = "0.00", errorTip = "";

        if (val > availableBalance) errorTip = "账户余额不够！请先去充值";
        else if (val < tenderAmountDown && tenderAmountDown <= leftTenderAmount) errorTip = "您的出借额最低不能低于" + tenderAmountDown + "元";
        else if (val > tenderAmountUp && tenderAmountUp > 0) errorTip = "您的出借额最大不能大于" + tenderAmountUp + "元";
        else if (val === 0) errorTip = "您的出借额是0元，请重新输入金额";
        else earnings = this.RateEarning(repaymentType, plannedAnnualRate / 100, bidAmount, val, leastPeriodValue);

        this.IsValidAmount = Common.IsNullOrEmpty(errorTip);
        this.setState({ investMoney: val, earnings: earnings, errorTip: errorTip });
    }

    RateEarning(repaymentType, rate, borrowMoney, capital, month) {
        const modeRepay = repaymentType && repaymentType.message ? repaymentType.message : "";

        var totalRate = 0;
        if (modeRepay === '等额本息') {
            var totalAmount = month * (borrowMoney * rate / 12 * Math.pow((1 + rate / 12), month)) / (Math.pow((1 + rate / 12), month) - 1);
            totalRate = (totalAmount - borrowMoney).toFixed(2);
        } else totalRate = (borrowMoney * rate / 12 * month).toFixed(2);

        return (totalRate * capital / borrowMoney).toFixed(2);
    }

    ChangeInvestMoney(e) {
        if (!this.IsInvest()) return;

        const { availableBalance, tenderAmountUp, leftTenderAmount } = this;

        var v = Common.GetFloatValue(e.target.value);
        var lessMoney = availableBalance < leftTenderAmount ? availableBalance : leftTenderAmount;

        if (tenderAmountUp !== 0) {
            var least = tenderAmountUp < lessMoney ? tenderAmountUp : lessMoney;
            if (v > least) v = least;
        } else if (v > lessMoney) v = lessMoney;

        this.setState({ investMoney: v });
    }

    JudgeQuestion() {
        const val = Common.GetFloatValue(this.state.investMoney);
        const { typeName, lastCount, nextTestTime, surplusAmount, availableBalance } = this;

        if (typeName !== '进取型' && !Common.IsNullOrEmpty(lastCount)) {
            if (surplusAmount > availableBalance && val > surplusAmount && surplusAmount > availableBalance) {
                if (lastCount === 0) this.DialogRatherTestElement.Show(surplusAmount, nextTestTime);
                else this.DialogNewNextTestElement.Show(surplusAmount);
                return false;
            } else if (availableBalance > surplusAmount && surplusAmount < val && val < availableBalance) {
                if (lastCount === 0) this.DialogRatherTestElement.Show(surplusAmount, nextTestTime);
                else this.DialogNewNextTestElement.Show(surplusAmount);
                return false;
            }
        }

        return true;
    }

    ToBid() {
        if (this.ToBidsDisabled || !this.IsValidAmount) return;
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
        const { plannedAnnualRate, bidAmount, leastPeriodValue, repaymentType, bidName, bidCode } = this;

        const income = this.RateEarning(repaymentType, plannedAnnualRate / 100, bidAmount, val, leastPeriodValue);
        const allIncome = val + income;

        this.DialogInvestmentXYDElement.Show({
            bidName: bidName,
            bidCode: bidCode,
            investMoney: val,
            plannedAnnualRate: plannedAnnualRate,
            leastPeriod: leastPeriodValue,
            actualPayment: val,
            allIncome: allIncome,
        });
    }

    render() {
        const { IsLogin, BidsDetail } = this.props;
        const Overview = this.GetPropsValue("Overview", {});
        const { investMoney, earnings, errorTip, riskChecked } = this.state;

        return (
            <div className='available-balance'>
                <h3>剩余可投金额</h3>
                <span className='rem-amount'><i>{Common.ToCurrency(BidsDetail.leftTenderAmount)}</i>元</span>
                <div className='progress-tip'>
                    <span>进度：<i>{BidsDetail.percent}</i>%</span>
                    <div className='progress-bar'>
                        <div className='existing' style={{ width: BidsDetail.percent + '%' }}></div>
                    </div>
                </div>
                {IsLogin && <div className='account-balance '>
                    <span>账户余额：<i>{Common.ToCurrency(Overview.availableBalance)}</i>元</span>
                    <a href='/usercenter/recharge.html'>充值</a>
                    <a onClick={this.OnClick("AllInvest")}>全投</a>
                </div>}
                <p>投标金额：<input type="text" maxLength={10} placeholder={BidsDetail.tenderAmountDown + '元起投'} value={investMoney} onBlur={this.OnBlur("investMoney")} onChange={this.ChangeInvestMoney.bind(this)} />元</p>
                <p>平均历史收益：<span>{earnings}</span>元</p>
                {IsLogin && BidsDetail.leftTenderAmount > 0 && <p className='risk-protocol'><input type="checkbox" onChange={this.CheckboxChange("riskChecked")} checked={riskChecked} />我已充分阅读本<a target='_blank'
                    href="/user/regRiskWarning.html">《资金出借风险提示函》</a>，知晓包括债权转让风险在内的相关风险提示，并将根据风险承受能力谨慎出借并承担风险。
                                </p>}
                <p className={"error-tip" + (Common.IsNullOrEmpty(errorTip) ? ' hide' : "")}>{errorTip}</p>
                {this.RenderBuyWrap()}
            </div>
        )
    }
}