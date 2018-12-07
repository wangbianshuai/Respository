import React from "react"
import { connect } from "dva"
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, Rotate, ComponentList, BackTop, StaticIndex, RootPage } from "ReactCommon";
import Partner from "./Partner";
import NewsMedia from "./NewsMedia";
import ScatteredAssignment from "./ScatteredAssignment";
import YJDJProduct from "./YJDJProduct";
import XYBProduct from "./XYBProduct";
import ThirtyTenderProduct from "./ThirtyTenderProduct";
import YYPProduct from "./YYPProduct";
import InvestmentRankList from "./InvestmentRankList";

class Index extends BaseIndex {
    constructor(props) {
        super(props);
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];

        return Promise.all(StaticIndex.InitInvokeActionList(app, Index.Actions, Index.GetPayload(token, ua)));
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

        this.InitInvokeActionList(Index.Actions, Index.GetPayload(this.Token));
    }

    GetAchievement() {
        const acht = { securityItem: { amount: "", unit: "" }, totalIncomeItem: { amount: "", unit: "" }, totalTradeItem: { amount: "", unit: "" } }
        const { Achievement } = this.props;

        if (!Achievement || Achievement.IsSuccess === false || !Achievement.items) return acht;

        if (this.Achievement) return this.Achievement;

        Achievement.items.forEach(a => {
            if (a.code === "TOTAL_REGISTER_USER") acht.totalRegister = Common.ToCurrency(a.nvalue, false);
            else if (a.code === "VENTURE_BALANCE") {
                acht.securityItem = {
                    code: "SECURITY_TIME",
                    name: "稳健运营时间",
                    amount: Achievement.time,
                    unit: ""
                };
            }
            else if (a.code === "TOTAL_INCOME") {
                acht.totalIncomeItem = {
                    name: a.inforName.replace("(元)", ""),
                    amount: (Common.GetFloatValue(a.nvalue) / 100000000).toFixed(2),
                    unit: "亿元"
                };
            }
            else if (a.code === "TOTAL_TRADE") {
                acht.totalTradeItem = {
                    name: a.inforName.replace("(元)", ""),
                    amount: (Common.GetFloatValue(a.nvalue) / 100000000).toFixed(2),
                    unit: "亿元"
                };
            }
        });

        this.Achievement = acht;

        return acht;
    }

    GetAdDataList() {
        if (this.AdDataList && this.AdDataList.length > 0) return this.AdDataList;

        const Ad = this.GetPropsValue("Ad", []);

        this.AdDataList = Ad.map(m => {
            return {
                imgurl: m.extendUrl,
                linkurl: m.textHref,
                title: m.text,
                imgId: m.id,
                content: ""
            }
        });

        return this.AdDataList;
    }

    render() {
        const { ZQZR, SBZT, Announcement, News, Media, More, PcBuildUrl, IsLogin, IsPurchased } = this.props;
        const Achievement = this.GetAchievement();
        const InvestmentRank = this.GetPropsValue("InvestmentRank", { items: [] });
        const ThirtyTender = this.GetPropsValue("ThirtyTender", { status: {} });
        const XYB = this.GetPropsValue("XYB", { items: [] });
        const YJDJ = this.GetPropsValue("YJDJ", { status: {} });
        const YYP = this.GetPropsValue("YYP", { status: {} });

        return (
            <React.Fragment>
                <div className="rotate-focus">
                    <Rotate DataList={this.GetAdDataList()} />
                    <div className="focus">
                        <div className="focus-main">
                            <div className="focus-title">累计注册人数</div>
                            <strong className="focus-rate">{Achievement.totalRegister}</strong>
                            <div className="focus-hot">稳健运营六年 专业可信赖</div>
                            {!IsLogin && <div className="focus-register">
                                <a href="/user/iregister.html" className="ga-click" ga-category="注册" ga-action="第一步" ga-label="红包按钮">
                                    领取108元红包
                                <div className="tip-wrap">
                                        <div className="line"></div>
                                        <b>10秒快速注册</b>
                                    </div>
                                </a>
                            </div>}
                            {!IsLogin && <div className="focus-login">已有账号？<a href="/user/ilogin.html">立即登录</a></div>}
                            {IsLogin && <div className="focus-register focus-my-xxd"><a href="/usercenter/accountInfo.html" className="ga-promo"><i className="my-xxd"></i>我的新新贷</a></div>}
                        </div>
                        <div className="focus-bg"></div>
                    </div>
                </div>
                <div className="main">
                    <div className="core">
                        <ul>
                            <li>
                                <div>
                                    <a href="/promotion/common/cifis.html" target="_blank"><i className="bg1"></i></a>
                                    <p>
                                        <a className="title" href="/promotion/common/cifis.html" target="_blank">互金协会成员</a>
                                        <a className="desc" href="/promotion/common/cifis.html"
                                            target="_blank">中国互联网金融协会首批会员</a>
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <a href="javascript:void(0);"><i className="bg2"></i></a>
                                    <p style={{ paddingRight: "30px" }}>
                                        <a className="title" href="javascript:void(0);">国资系,新实力</a>
                                        <a className="desc" href="javascript:void(0);">国有企业战略投资</a>
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <a href="/html/storagepage/index.html" target="_blank"><i className="bg3"></i></a>
                                    <p>
                                        <a className="title" href="/html/storagepage/index.html" target="_blank">资金银行存管</a>
                                        <a className="desc" href="/html/storagepage/index.html" target="_blank">用户资金与平台隔离，资金交易由存管银行全程监督</a>
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <a href="/security/security.html?type=fxkz" target="_blank"><i className="bg4"></i></a>
                                    <p>
                                        <a className="title" href="/html/help/safesecurity.html" target="_blank">银行级别风控</a>
                                        <a className="desc" href="/html/help/safesecurity.html" target="_blank">媲美银行的CLAC风控审核系统"天权"信用评分模型行业领先</a>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="product clearfix">
                        <div className="product-invest">
                            {!IsPurchased && <ThirtyTenderProduct ThirtyTender={ThirtyTender} />}
                            <YJDJProduct YJDJ={YJDJ} />
                            <div className="dimension dimension-group">
                                <div className="dimension-title dimension-title-group">
                                    <div className="time">自动投标工具，持有30天后可转让</div>
                                    <i className="group"></i>
                                </div>
                                <XYBProduct XYB={XYB} />
                                <YYPProduct YYP={YYP} PcBuildUrl={PcBuildUrl} />
                            </div>
                            <ScatteredAssignment SBZT={SBZT} ZQZR={ZQZR} />
                        </div>
                        <div className="product-info">
                            <div className="volume-of-transaction">
                                <ul>
                                    <li className="li1"><i></i><a href="/html/help/datadisclose.html">{Achievement.totalTradeItem.amount + Achievement.totalTradeItem.unit}</a>
                                    </li>

                                    <li className="li3">{Achievement.totalIncomeItem.name}<a href="/html/help/datadisclose.html">{Achievement.totalIncomeItem.amount + Achievement.totalIncomeItem.unit}</a>
                                    </li>
                                    <li className="li2">{Achievement.securityItem.name}<a href="/html/help/datadisclose.html">{Achievement.securityItem.amount}</a></li>
                                </ul>
                            </div>
                            <div className="notice">
                                <div className="title">最新公告<a href="/html/help/platform.html" className="more" target='_blank'>更多</a></div>
                                <ul>
                                    {Announcement && Announcement.map && Announcement.map(m => <li key={Common.CreateGuid()}><a href={m.textHref}>{m.text}</a></li>)}
                                </ul>
                            </div>
                            <InvestmentRankList InvestmentRank={InvestmentRank} />
                            <NewsMedia News={News} Media={Media} />
                            <div className="ad">
                                <a href="/html/introduce/guide.html" className="ga-click">
                                    <img width="330" src={PcBuildUrl + "img/330-176-index.png"} /></a>
                            </div>
                            <div className="qr-code">
                                <table><tbody>
                                    <tr className="tr1">
                                        <td colSpan="2">扫一扫下载/关注新新贷</td>
                                    </tr>
                                    <tr className="tr2">
                                        <td>
                                            <img src={PcBuildUrl + "css/i/qr-code-phone.png"} width="92" />
                                        </td>
                                        <td>
                                            <img src={PcBuildUrl + "css/i/qr-code-wechat.png"} width="92" />
                                        </td>
                                    </tr>
                                    <tr className="tr3">
                                        <td>手机客户端</td>
                                        <td>微信公众号</td>
                                    </tr></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Partner DataList={this.props.Partner} />
                    <div className="partner">
                        <div className="title">了解更多</div>
                        <ul className="ml-75">
                            {More && More.map && More.map(m => <li key={Common.CreateGuid()}><div><a href={m.textHref} target="_blank"><img src={m.extendUrl} /></a></div><a href={m.textHref}>{m.text}</a></li>)}
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        Ad: state.BizService.Ad,
        Achievement: state.BizService.Achievement,
        Announcement: state.BizService.Announcement,
        News: state.BizService.News,
        Media: state.BizService.Media,
        InvestmentRank: state.BizService.InvestmentRank,
        Partner: state.BizService.Partner,
        More: state.BizService.More,
        ZQZR: state.TradeCenterService.ZQZR,
        SBZT: state.TradeCenterService.SBZT,
        ThirtyTender: state.TradeCenterService.ThirtyTender,
        YJDJ: state.TradeCenterService.YJDJ,
        XYB: state.TradeCenterService.XYB,
        YYP: state.TradeCenterService.YYP
    });

    !Common.IsDist && console.log(props);
    return props;
}

Index.Actions = StaticIndex.MapActions({
    BizService: ["GetAd", "GetAchievement", "GetAnnouncement", "GetNews", "GetMedia", "GetInvestmentRank", "GetPartner", "GetMore"],
    TradeCenterService: ["GetZQZR", "GetSBZT", "GetThirtyTender", "GetYJDJ", "GetXYB", "GetYYP"]
});

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(Index));