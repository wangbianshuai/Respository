import React from "react"
import { connect } from "dva"
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, ComponentList, BackTop } from "ReactCommon";
import RecommendList from "./RecommendList";

class PurchaseSuccess extends BaseIndex {
    constructor(props) {
        super(props);


        this.IsConsumption = false;
    }

    GetTitle() {
        return "新新贷-系统提示";
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];

        return Promise.all(BaseIndex.InitInvokeActionList(app, PurchaseSuccess.Actions, PurchaseSuccess.GetPayload(token, ua)));
    }

    static GetPayload(token, ua) {
        return {
            Token: token,
            UserAgent: ua,
            InvestmentService: { InvestStatus: { data: {} } }
        };
    }

    componentDidMount() {
        this.Token = Common.GetCookie("Token");

        this.InitInvokeActionList(PurchaseSuccess.Actions, PurchaseSuccess.GetPayload(this.Token));

        this.InitSet();
    }

    InitSet() {
        this.tenderType = Common.GetCookie("tenderType");
        this.historyUrl = Common.GetCookie("historyUrl");
        this.realToken = Common.IsNullOrEmpty(this.Token) ? Common.GetCookie("userToken") : this.Token;

        var referrerUrl;
        if (document.referrer) referrerUrl = document.referrer.split('/');
        else if (this.historyUrl) referrerUrl = historyUrl.split('/');

        if (referrerUrl) {
            this.url = referrerUrl[referrerUrl.length - 1];
            this.consumptionUrl = referrerUrl.length > 1 ? referrerUrl[referrerUrl.length - 2] : "";  //消费贷地址不一样

            this.IsConsumption = consumptionUrl.indexOf('consumption') >= 0;
        }

        if (!this.IsConsumption && this.tenderType) this.Dispatch("TradeCenterService", "GetRecommend", { Url: `investBiz/recommend?tenderType=${this.tenderType}` });
    }

    ToRecord() {
        const { url, consumptionUrl } = this;
        if (!url) return;

        if (url.indexOf('monthgold') >= 0) window.location.href = '/usercenter/tender/monthgold.html';
        else if (url.indexOf('sevengold') >= 0) window.location.href = '/usercenter/tender/sevengold.html';
        else if (url.indexOf('newtender') >= 0) window.location.href = '/usercenter/tender/newtender.html';
        else if (url.indexOf('thirtytender') >= 0) window.location.href = '/usercenter/tender/thirtytender.html';
        else if (consumptionUrl && consumptionUrl.indexOf('consumption') >= 0) window.location.href = '/usercenter/tender/investment.html';
    }

    ToPurchase() {
        const { historyUrl, consumptionUrl } = this;
        if (!consumptionUrl) return;

        if (consumptionUrl.indexOf('consumption') >= 0) window.location.href = '/detail/consumptionList.html';
        else {
            if (document.referrer) window.location.href = document.referrer;
            else if (historyUrl) window.location.href = historyUrl;
        }
    }

    render() {
        const PcBuildUrl = this.GetPcBuildUrl();
        const { Link, Recommend } = this.props;
        const IsLogin = this.JudgeLogin();
        const UserInfo = this.GetPropsValue("UserInfo", {});
        const IsPurchased = this.props.InvestStatus === true;

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} Page={this} IsLogin={IsLogin} NickName={UserInfo.nickname} UserType={UserInfo.userType} IsPurchased={IsPurchased} />

                <div className="detail-crumbs">
                    <div className="crumbs">
                        <a href="//www.xinxindai.com/">首页</a> &gt; <a href='/usercenter/accountInfo.html'>我的新新贷</a> &gt; <b>操作成功</b>
                    </div>
                </div>

                <div className='container'>
                    <div className='success'>
                        <div className='success-focus'>

                            <h2><i></i>恭喜您，加入成功！</h2>
                            <div className="button-warp">
                                <input type="button" value='查看我的加入记录' className='record' onClick={this.ToRecord.bind(this)} />
                                <input type="button" value='继续投标' className='purchase' onClick={this.ToPurchase.bind(this)} />
                            </div>
                        </div>
                        <div className="notice-txt">
                            【重要提醒】根据政策对您权益保障的合规性要求，您需要在服务期到期后，在加入记录中点击”申请退出“按钮进行债权转让，全部债权转让完成后资金将返至您新新贷账户
                         </div>

                    </div>
                    {!this.IsConsumption && <RecommendList DataList={Recommend} />}
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
        Recommend: state.TradeCenterService.Recommend
    });

    !Common.IsDist && console.log(props);
    return props;
}

PurchaseSuccess.Actions = BaseIndex.MapActions({});

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(PurchaseSuccess);