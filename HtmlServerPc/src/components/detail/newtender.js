import React from "react";
import { connect } from "dva";
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, ComponentList, BackTop } from "ReactCommon";
import NewTenderInfo from "./NewTenderInfo";
import NewTenderTabs from "./NewTenderTabs";
import NewTenderInvest from "./NewTenderInvest";

class NewTender extends BaseIndex {
    constructor(props) {
        super(props);
        this.ProductName = "新手标";
    }

    //服务器渲染加载数据
    static async LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];
        const months = ctx.params.months || 1;

        const sign = "XSB", sign2 = "XSB" + months;
        const mine = token ? "/mine" : "";
        const payload = { Url: `investProduct/${sign}${mine}?prcode=${sign2}`, Token: token, UserAgent: ua };
        const data = await BaseIndex.Dispatch(app, "TradeCenterService", "GetInvestProduct", payload);
        const id = data && data.id ? data.id : "";

        NewTender.Actions.TradeCenterService.push("GetInvestmentRecord");

        return Promise.all(BaseIndex.InitInvokeActionList(app, NewTender.Actions, NewTender.GetPayload(token, ua, sign, sign2, id)));
    }

    static GetPayload(token, ua, sign, sign2, id) {
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
        else payload.TradeCenterService.GetInvestProduct = { Url: `investProduct/${sign}${mine}?prcode=${sign2}` };

        return payload;
    }

    componentDidMount() {
        this.Token = Common.GetCookie("Token");
        const ms = window.location.href.match(/newtender-\/(\S*).html/i);
        this.Months = ms && ms.length > 1 ? ms[1] : "";
        this.Months = this.Months || 1;
        this.Sign = "XSB";
        this.Sign2 = "XSB" + this.Months;

        NewTender.Actions.TradeCenterService.push("GetInvestProduct");

        this.InitInvokeActionList(NewTender.Actions, NewTender.GetPayload(this.Token, null, this.Sign, this.Sign2));
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
                        <a href="//www.xinxindai.com/">首页</a> &gt; <b>我要出借</b> &gt; <b>新手标</b>
                    </div>
                </div>

                <div className='container'>
                    <div className='product-info clearfix'>
                        <NewTenderInfo Page={this} InvestProduct={InvestProduct} />
                        <NewTenderInvest Page={this} InvestProduct={InvestProduct} IsLogin={IsLogin} />
                    </div>
                    <div className='plan'>
                        <p className='title'>计划示意图</p>
                        {InvestProduct.period === '1' && <div><img src={PcBuildUrl + 'img/newtender_1m@2x.png'} /></div>}
                        {InvestProduct.period === '3' && <div><img src={PcBuildUrl + 'img/newtender_3m@2x.png'} /></div>}
                    </div>
                    <NewTenderTabs Page={this} InvestmentRecord={InvestmentRecord} InvestProduct={InvestProduct} FinanceBorrowList={FinanceBorrowList} ProductName={this.ProductName} />
                </div>

                <Footer PcBuildUrl={PcBuildUrl} Link={Link} Page={this} />
                <ComponentList Name="Tips" Page={this} />
                <ComponentList Name="Dialogs" Page={this} />
                <BackTop Page={this} />
            </div >
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

NewTender.Actions = BaseIndex.MapActions({ TradeCenterService: ["QueryFinanceBorrowList"] });

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(NewTender);