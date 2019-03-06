import React from "react"
import { connect } from "dva"
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, ComponentList, BackTop } from "ReactCommon";
import ConsumptionTabs from "./ConsumptionTabs";
import LoanInfo from "./LoanInfo";
import InvestBuy from "./InvestBuy";

class ConsumptionDetail extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "散标直投_新宜贷";
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];
        const bidCode = ctx.params.bidCode;

        return Promise.all(BaseIndex.InitInvokeActionList(app, ConsumptionDetail.Actions, ConsumptionDetail.GetPayload(token, ua, bidCode)));
    }

    static GetPayload(token, ua, bidCode) {
        return {
            Token: token,
            UserAgent: ua,
            InvestmentService: { InvestStatus: { data: {} } },
            IntegrationService: {
                GetBidsDetail: { Url: `bids/${bidCode}` },
                GetBidsBorrower: { Url: `bids/${bidCode}/borrower` },
                GetBidsInfoDisclosures: { Url: `bids/${bidCode}/infoDisclosures` },
                GetBidsRepayments: { Url: `bids/${bidCode}/repayments` },
                GetBidsInvestments: { Url: `bids/${bidCode}/investments?currentPage=1&pageSize=10` }
            }
        };
    }

    componentDidMount() {
        this.Token = Common.GetCookie("Token");
        const ms = window.location.href.match(/consumption\/(\S*).html/i);
        this.BidCode = ms && ms.length > 1 ? ms[1] : "";

        this.InitInvokeActionList(ConsumptionDetail.Actions, ConsumptionDetail.GetPayload(this.Token, undefined, this.BidCode));
    }

    render() {
        const PcBuildUrl = this.GetPcBuildUrl();
        const { Link, BidsRepayments, BidsBorrower, BidsInfoDisclosures, Overview, BidsInvestments, QuestionUser } = this.props;
        const IsLogin = this.JudgeLogin();
        const UserInfo = this.GetPropsValue("UserInfo", {});
        const IsPurchased = this.props.InvestStatus === true;
        const BidsDetail = this.GetPropsValue("BidsDetail", { status: {}, loanPurpose: {}, repaymentType: {}, isSupportCreditAssignment: {} });

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} Page={this} IsLogin={IsLogin} NickName={UserInfo.nickname} UserType={UserInfo.userType} IsPurchased={IsPurchased} />

                <div className="detail-crumbs">
                    <div className="crumbs">
                        <a href="//www.xinxindai.com/">首页</a> &gt; <b>新宜贷</b> &gt; <b>标的详情</b>
                    </div>
                </div>
                <div className='container'>
                    <h2>{BidsDetail.bidName}&nbsp;&nbsp;&nbsp;借款编号：{BidsDetail.bidCode} <a href="/detail/consumptionList.html">返回标的列表</a></h2>
                    <div className='loan-container'>
                        <div className='loan clearfix'>
                            <LoanInfo BidsDetail={BidsDetail} />
                            <InvestBuy IsLogin={IsLogin} BidsDetail={BidsDetail} Overview={Overview} QuestionUser={QuestionUser} Page={this} />
                        </div>
                        <div className='loan-info'>
                            <div dangerouslySetInnerHTML={{ __html: BidsDetail.expenseExplanation }}></div>
                            <p>合同范本：<a href="/html/commitment/index.html" target='_blank'>查看详情</a></p>
                        </div>
                    </div>
                    <ConsumptionTabs Page={this} IsLogin={IsLogin} BidsBorrower={BidsBorrower} BidsInfoDisclosures={BidsInfoDisclosures} BidsDetail={BidsDetail} BidsRepayments={BidsRepayments} BidsInvestments={BidsInvestments} />
                </div>
                <Footer PcBuildUrl={PcBuildUrl} Link={Link} Page={this} />
                <ComponentList Name="Tips" Page={this} />
                <ComponentList Name="Dialogs" Page={this} />
                <BackTop Page={this} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = BaseIndex.MapStateToProps(state, ownProps, {
        BidsDetail: state.IntegrationService.BidsDetail,
        BidsBorrower: state.IntegrationService.BidsBorrower,
        BidsInfoDisclosures: state.IntegrationService.BidsInfoDisclosures,
        BidsRepayments: state.IntegrationService.BidsRepayments,
        BidsInvestments: state.IntegrationService.BidsInvestments,
        QuestionUser: state.UserCenterService.QuestionUser,
        Overview: state.InvestmentService.Overview,
        HasComplete: state.XxdService.HasComplete,
        AuthorizedQuota: state.TradeCenterService.AuthorizedQuota,
        PayPwdByTokenWithValidate: state.UserCenterService.PayPwdByTokenWithValidate,
        InvestOrder: state.TradeCenterService.InvestOrder
    });

    !Common.IsDist && console.log(props);
    return props;
}

ConsumptionDetail.Actions = BaseIndex.MapActions({
    IntegrationService: ["GetBidsDetail", "GetBidsBorrower", "GetBidsInfoDisclosures", "GetBidsRepayments", "GetBidsInvestments"],
    UserCenterService: ["GetQuestionUser"],
    InvestmentService: ["Overview"]
});

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(ConsumptionDetail);