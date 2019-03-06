import React from "react"
import { connect } from "dva"
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, ComponentList, BackTop } from "ReactCommon";
import ThirtyTenderTabs from "./ThirtyTenderTabs";
import ThirtyTenderInfo from "./ThirtyTenderInfo";
import ThirtyTenderInvest from "./ThirtyTenderInvest";

class ThirtyTender extends BaseIndex {
    constructor(props) {
        super(props);
        this.ProductName = "新元宝（新手专享）";
    }

    //服务器渲染加载数据
    static async LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];

        const sign = "XSCP30T";
        const mine = token ? "/mine" : "";
        const payload = { Url: `investProduct/${sign}${mine}?prcode=${sign}`, Token: token, UserAgent: ua };
        const data = await BaseIndex.Dispatch(app, "TradeCenterService", "GetInvestProduct", payload);
        const id = data && data.id ? data.id : "";

        ThirtyTender.Actions.TradeCenterService.push("GetInvestmentRecord");

        return Promise.all(BaseIndex.InitInvokeActionList(app, ThirtyTender.Actions, ThirtyTender.GetPayload(token, ua, sign, id)));
    }

    static GetPayload(token, ua, sign, id) {
        const mine = token ? "/mine" : "";

        const payload = {
            Token: token,
            UserAgent: ua,
            InvestmentService: { InvestStatus: { data: {} } },
            TradeCenterService: {
                QueryFinanceBorrowList: { Url: "investBiz/queryFinanceBorrowList?currentPage=1&pageSize=10" }
            }
        };

        if (id) payload.TradeCenterService.GetInvestmentRecord = { Url: `investProduct/${sign}/investmentRecord?reglintstId=${id}&currentPage=1&pageSize=10` };
        else payload.TradeCenterService.GetInvestProduct = { Url: `investProduct/${sign}${mine}?prcode=${sign}` };

        return payload;
    }

    componentDidMount() {
        this.Token = Common.GetCookie("Token");
        this.Sign = "XSCP30T";

        ThirtyTender.Actions.TradeCenterService.push("GetInvestProduct");

        this.InitInvokeActionList(ThirtyTender.Actions, ThirtyTender.GetPayload(this.Token, null, this.Sign));
    }

    PropsChanged(nextProps) {
        if (this.JudgeChanged(nextProps, "InvestProduct")) this.ReceiveInvestProduct(nextProps.InvestProduct)
    }

    ReceiveInvestProduct(investProduct) {
        if (this.IsSuccessNextsProps(investProduct)) {
            const { Sign } = this;
            const { id } = investProduct;
            id && this.Dispatch("TradeCenterService", "GetInvestmentRecord", { Url: `investProduct/${Sign}/investmentRecord?reglintstId=${id}&currentPage=1&pageSize=10` })
        }
    }

    render() {
        const PcBuildUrl = this.GetPcBuildUrl();
        const { Link, InvestmentRecord, FinanceBorrowList } = this.props;
        const IsLogin = this.JudgeLogin();
        const UserInfo = this.GetPropsValue("UserInfo", {});
        const IsPurchased = this.props.InvestStatus === true;
        const InvestProduct = this.GetPropsValue("InvestProduct", {});

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} Page={this} IsLogin={IsLogin} NickName={UserInfo.nickname} UserType={UserInfo.userType} IsPurchased={IsPurchased} />

                <div className="detail-crumbs">
                    <div className="crumbs">
                        <a href="//www.xinxindai.com/">首页</a> &gt; <b>我要出借</b> &gt; <b>新元宝（新手专享）</b>
                    </div>
                </div>
                <div className='container clearfix'>
                    <div className='product-info clearfix'>
                        <ThirtyTenderInfo Page={this} InvestProduct={InvestProduct} />
                        <ThirtyTenderInvest Page={this} InvestProduct={InvestProduct} IsLogin={IsLogin} />
                    </div>
                    <div className="count-rate">
                        <ul>
                            <li><a href="#">计划示意图</a></li>
                        </ul>
                        <div className="rate-img">
                            <img src={PcBuildUrl + 'img/thirtytender_img@2x.png'} />
                        </div>
                    </div>
                    <ThirtyTenderTabs Page={this} InvestmentRecord={InvestmentRecord} InvestProduct={InvestProduct} FinanceBorrowList={FinanceBorrowList} ProductName={this.ProductName} />
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
        InvestProduct: state.TradeCenterService.InvestProduct,
        InvestmentRecord: state.TradeCenterService.InvestmentRecord,
        FinanceBorrowList: state.TradeCenterService.FinanceBorrowList,
        RedenvelopeRecord: state.TradeCenterService.RedenvelopeRecord
    });

    !Common.IsDist && console.log(props);
    return props;
}

ThirtyTender.Actions = BaseIndex.MapActions({ TradeCenterService: ["QueryFinanceBorrowList"] });

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(ThirtyTender);