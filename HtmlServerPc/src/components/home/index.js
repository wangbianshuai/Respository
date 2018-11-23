import React from "react"
import { connect } from "dva"
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, Rotate } from "ReactCommon";

class Index extends BaseIndex {
    constructor(props) {
        super(props);
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];

        return Promise.all(BaseIndex.InitInvokeActionList(app, Index.Actions, Index.GetPayload(token, ua)));
    }

    static GetPayload(token, ua) {
        return {
            Token: token,
            UserAgent: ua,
            InvestmentService: { InvestStatus: { data: {} } }
        };
    }

    componentDidMount() {
        this.Token = Common.GetCookie("token");

        this.InitInvokeActionList(Index.Actions, Index.GetPayload(this.Token));
    }

    GetThirtyTenderProduct(data) {
        return {
            id: data.id,
            name: "七天大胜",
            category: `七天大胜/${data.plannedAnnualRate}%/${data.leastPeriod}${data.leastPeriodUnit}`
        }
    }

    GetYJDJProduct(data) {
        return {
            id: data.id,
            name: "月进斗金",
            category: `月进斗金/${data.plannedAnnualRate}%/${data.leastPeriod}${data.leastPeriodUnit}`
        }
    }

    GetXYBProduct(item) {
        return {
            id: item.id,
            name: "新元宝",
            category: `新元宝/${item.plannedAnnualRateTo}%/${item.frozenPeriod}个月`
        }
    }

    GetSBZTProduct(item) {
        return {
            id: item.id,
            name: "散标直投",
            category: `散标直投/${item.plannedAnnualRate}%/${item.leastPeriod}${item.leastPeriodUnit}`
        }
    }

    GetZQZRProduct(item) {
        return {
            id: item.id,
            name: "债权转让",
            category: `债权转让/${item.plannedAnnualRate}%/${item.leastPeriod}${item.leastPeriodUnit}`
        }
    }

    RenderXYBProductItems(item) {
        return (
            <div className="dimension-q clearfix" key={Common.CreateGuid()}>
                <div className="rate">历史年化收益：
                <span className='w85'>{item.plannedAnnualRateTo + '%'}</span>
                    {!Common.IsNullOrEmpty(item.remark) && <div className="tag-hot"><p><span>{item.remark}</span></p></div>}
                    {item.floatingRate > 0 && <span className="plus"> + {item.floatingRate}%</span>}
                </div>
                <div className="limit"><i></i><i><span>{item.frozenPeriod}</span>个月<br />后可免费申请转让</i></div>
                <div className="money">起投金额：<span>{item.leastTenderAmountLabel}</span></div>
                <div>
                    {item.status.code === "WAIT_TO_SELL" && <a href={'/xplan/detail/' + item.id + '.html'} target="_blank"
                        className="btn-active disable">{item.status.message}</a>}

                    {item.status.code === "SELLING" && <a href={'/xplan/detail/' + item.id + '.html'} target="_blank"
                        className="btn-active ga-click xa-click">立即加入</a>}

                    {item.status.code === "SOLD_OUT" && <a href={'/xplan/detail/' + item.id + '.html'} target="_blank"
                        className="btn-active disable">{item.status.message}</a>}

                    {item.status.code === "EARNING" && <a href={'/xplan/detail/' + item.id + '.html'} target="_blank"
                        className="btn-active disable">{item.status.message}</a>}
                </div>
            </div>
        )
    }

    RenderSBZTProductItems(item) {
        return (
            <ul className="clearfix" key={Common.CreateGuid()}>
                <li className='grade'>
                    <i className={"grade" + item.riskGrade}></i>
                </li>
                <li>
                    {item.label === "ic-xfd" && <i className="icon house-icon"></i>}
                    {item.label === "ic-xcd" && <i className="icon car-icon"></i>}
                    {item.label === "ic-xsd" && <i className="icon business-icon"></i>}
                    {item.label === "ic-xstd" && <i className="icon new-icon"></i>}
                    {item.label === "ic-pxb" && <i className="icon"></i>}
                </li>
                <li className="name"><a href={'borrow/detail/' + item.id + '.html'} target="_blank"
                    title={item.title}>{item.title}</a></li>
                <li className="rate"><span>{item.plannedAnnualRate}</span>%</li>
                <li className="time"><span>{item.leastPeriod + item.leastPeriodUnit}</span></li>
                <li className="money">{'剩余：' + Common.ToCurrency(item.leftAmount) + '元'}
                    <div className="j-process" position="bottom" tipcontent={Common.GetIntValue(((item.bidAmount - item.leftAmount) * 1.00 / item.bidAmount * 100))}>
                        <span></span></div>
                </li>
                <li className="buy">
                    {item.status.code === "SBZT_WAIT_TO_SELL" && <a href={'borrow/detail/' + item.id + '.html'} target="_blank"
                        className="snapped disable">{item.status.message}</a>}

                    {item.status.code === "SBZT_SELLING" && <a href={'borrow/detail/' + item.id + '.html'} target="_blank"
                        className="snapped ga-click xa-click">立即加入</a>}

                    {item.status.code === "SBZT_SOLD_OUT" && <a href={'borrow/detail/' + item.id + '.html'} target="_blank"
                        className="snapped disable">{item.status.message}</a>}
                </li>
            </ul>
        )
    }

    RenderZQZRProductItems(item) {
        return (
            <ul key={Common.CreateGuid()}>
                <li className='grade'>  <i className={"grade" + item.riskGrade}></i></li>
                <li>
                    {item.label === "ic-xfd" && <i className="icon house-icon"></i>}
                    {item.label === "ic-xcd" && <i className="icon car-icon"></i>}
                    {item.label === "ic-xsd" && <i className="icon business-icon"></i>}
                    {item.label === "ic-xstd" && <i className="icon new-icon"></i>}
                    {item.label === "ic-pxb" && <i className="icon"></i>}
                </li>
                <li className="name"><a href={'/traderequest/requestDetail/' + item.id + '.html'} target="_blank" title={item.name}>{item.name}</a></li>
                <li className="rate"><span>{item.plannedAnnualRate}</span>%</li>
                <li className="time">剩余：<span>{item.leastPeriod + item.leastPeriodUnit}</span></li>
                <li className="money">{'转让价：' + Common.ToCurrency(item.transferPrice) + '元'}
                </li>
                <li className="buy">

                    {item.status.code === "ZQZR_WAIT_TO_SELL" && <a href={'/traderequest/requestDetail/' + item.id + '.html'} target="_blank"
                        className="snapped disable">{item.status.message}</a>}

                    {item.status.code === "ZQZR_SELLING" && <a href={'/traderequest/requestDetail/' + item.id + '.html'} target="_blank"
                        className="snapped ga-click xa-click" > 立即加入</a>}

                    {item.status.code === "ZQZR_SOLD_OUT" && <a href={'/traderequest/requestDetail/' + item.id + '.html'} target="_blank"
                        className="snapped disable">{item.status.message}</a>}
                </li>
            </ul>
        )
    }

    RenderInvestmentRankRow(item, index) {
        return (
            <tr key={Common.CreateGuid()}>
                <td className="sort"><span>{index + 1}</span></td>
                <td>{item.nickName}</td>
                <td className="money">{'￥' + Common.ToCurrency(item.investmentAmount) + '元'}</td>
            </tr>
        )
    }

    GetAchievement() {
        const acht = { securityItem: { amount: "", unit: "" }, totalIncomeItem: { amount: "", unit: "" }, totalTradeItem: { amount: "", unit: "" } }
        const { Achievement } = this.props;

        if (!Achievement || Achievement.IsSuccess === false || !Achievement.items) return acht;

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

        return acht;
    }

    GetAdDataList() {
        const Ad = this.GetPropsValue("Ad", "map", []);

        return Ad.map(m => {
            return {
                imgurl: m.extendUrl,
                linkurl: m.textHref,
                title: m.text,
                imgId: m.id,
                content: ""
            }
        });
    }

    render() {
        const { TipList } = this.state;
        const PcBuildUrl = this.GetPcBuildUrl();
        const { Link, ZQZR, SBZT, Announcement, News, Media, Partner, More } = this.props;

        const ThirtyTender = this.GetPropsValue("ThirtyTender", "id", { status: {} });
        const InvestmentRank = this.GetPropsValue("InvestmentRank", "currentMonth", { items: [] });
        const Achievement = this.GetAchievement();
        const XYB = this.GetPropsValue("XYB", "name", { items: [] });
        const YJDJ = this.GetPropsValue("YJDJ", "id", { status: {} });
        const YYP = this.GetPropsValue("YYP", "id", { status: {} });
        const IsLogin = this.JudgeLogin();
        const UserInfo = this.GetPropsValue("UserInfo", "userid", {});;
        const IsPurchased = this.props.InvestStatus === true;

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} Page={this} IsLogin={IsLogin} NickName={UserInfo.nickname} IsPurchased={IsPurchased} />
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
                            {!IsPurchased && <div className="dimension clearfix dimension-thirtytender" id="J_qtds">
                                <div className="dimension-title dimension-title-thirty">
                                    <h6>新手专区</h6>
                                    <p>新手用户&nbsp;专享福利</p>
                                    <a href="/detail/thirtytender.html">查看详情</a>
                                </div>
                                <div className='dimension-con'>
                                    <dl className="dimension-name clearfix">
                                        <dt>新元宝（新手专享）</dt>
                                        <dd>限参与一次</dd>
                                        <span>已累计加入：{ThirtyTender.accumulatedInvestors}</span>
                                    </dl>
                                    <ul className="dimension-buy clearfix">
                                        <li className="rate">
                                            <div className="wrap">
                                                <i>{ThirtyTender.plannedAnnualRate}</i>%
                                          {ThirtyTender.floatingRate > 0 && <div className="plus">+{ThirtyTender.floatingRate}%
                                                <p className='xszx-tip'>
                                                        新手专享加息
                                                    <i></i>
                                                    </p>
                                                </div>}
                                            </div>
                                            <br />历史年化收益
                                        </li>
                                        <li>
                                            <span>{ThirtyTender.leastPeriod}{ThirtyTender.leastPeriodUnit}</span><br />
                                            后可申请转让
                                        </li>
                                        <li><span>{ThirtyTender.leastTenderAmountLabel}</span><br />起投金额</li>
                                        <li className="dimension-btn">
                                            {ThirtyTender.status.code === "WAIT_TO_SELL" && <a target="_blank" className="btn-active ga-click xa-click disable" >{ThirtyTender.status.message}</a>}

                                            {ThirtyTender.status.code === "SELLING" && <a href="/detail/thirtytender.html" target="_blank" className="btn-active ga-click xa-click">立即加入</a>}

                                            {ThirtyTender.status.code === "SOLD_OUT" && <a target="_blank" className="btn-active ga-click xa-click disable">{ThirtyTender.status.message}</a>}
                                        </li>
                                    </ul>
                                </div>
                            </div>}
                            <div className="dimension dimension-gold clearfix">
                                <div className="dimension-title dimension-title-gold">
                                    <h6>人气专区</h6>
                                    <div className="time">每天10:00、20:00发售</div>
                                    <a href="/detail/monthgold.html">查看详情</a>

                                </div>
                                <div className='dimension-con'>
                                    <dl className="dimension-name dimension-name-gold clearfix">
                                        <dt>月进斗金</dt>
                                        <dd>每日限量|先到先得</dd>
                                        <div className="tip tip-gold j_countdown" data-activite-time={YJDJ.lefTime}>
                                            <p>距离结束还剩：</p>
                                            <span></span>
                                        </div>
                                    </dl>
                                    <ul className="dimension-buy clearfix">
                                        <li className="rate"><span><i>{Common.GetIntValue(YJDJ.plannedAnnualRate)}</i>%</span><br />历史年化收益</li>
                                        <li>
                                            <span>{YJDJ.leastPeriod}{YJDJ.leastPeriodUnit}</span><br />
                                            后可申请转让
                                            </li>
                                        <li>
                                            <span>{Common.ToCurrency(Common.GetIntValue(YJDJ.plannedAmount), false)}元</span><br />计划金额
                                            </li>
                                        <li className="dimension-btn">

                                            {YJDJ.status.code === "WAIT_TO_SELL" && <a target="_blank" className="btn-active disable">{YJDJ.status.message}</a>}

                                            {YJDJ.status.code === "SELLING" && <a href="/detail/monthgold.html" target="_blank" className="btn-active ga-click xa-click">立即加入</a>}

                                            {YJDJ.status.code === "SOLD_OUT" && <a target="_blank" className="btn-active disable">本场已结束</a>}

                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="dimension dimension-group">
                                <div className="dimension-title dimension-title-group">
                                    <div className="time">自动投标工具，持有30天后可转让</div>
                                    <i className="group"></i>
                                </div>
                                <div className="dimension-block">
                                    <div className="dimension-info clearfix">
                                        <h2>新元宝</h2>
                                        <ul>
                                            <li>募集成功后次日起息</li>
                                        </ul>
                                        <div className="count">累计加入：{XYB.accumulatedInvestors}</div>
                                    </div>
                                    {XYB.items.map(m => this.RenderXYBProductItems(m))}
                                </div>
                                <div className="dimension-block overauto">
                                    <div className="dimension-info clearfix">
                                        <h2>月月派<i className="logo"></i>
                                        </h2>
                                        {!Common.IsNullOrEmpty(YYP.remark) && <div className="tag-hot">
                                            <p><span>{YYP.remark}</span></p>
                                        </div>}
                                        <ul>
                                            <li>每月派息</li>
                                            <li>募集成功后次日起息，持有30天后可转让</li>
                                        </ul>
                                    </div>
                                    <div className="dimension-q clearfix">
                                        <div className="rate">历史年化收益：
                                        <i><span>{YYP.plannedAnnualRateTo}%</span></i>
                                            {!Common.IsNullOrEmpty(YYP.floatingRate) && <div className="plus">+{YYP.floatingRate}%</div>}
                                        </div>
                                        <div className="limit"><span></span><span>{YYP.frozenPeriod}<br />后可免费申请转让</span></div>
                                        <div className="money">起投金额：{YYP.leastTenderAmountLabel}</div>
                                        <a target="_blank" className="dimension-mobile-btn">
                                            <span>APP专享</span><br />
                                            累计加入:<i>{YYP.accumulatedInvestors}</i>
                                        </a>
                                    </div>
                                    <div className="download-QRcode" id="download-qr-code">
                                        <img width="128" alt="新新贷app下载二维码" src={PcBuildUrl + "img/qr-code-phone@2x.png"} /><p>手机APP下载</p>
                                    </div>
                                </div>
                            </div>
                            <div className="scattered-and-assignment">
                                <div className="tab">
                                    <ul id="J_scatteredAndAssignment">
                                        <li className="active" tag="J_scattered">散标直投</li>
                                        <li tag="J_assignment">债权转让<i></i></li>
                                    </ul>
                                    <a className="more" href="/borrow/search/list.html" target="_blank">查看更多</a>
                                </div>
                                <div className="scattered" id="J_scattered">
                                    {SBZT && SBZT.map && SBZT.map(m => this.RenderSBZTProductItems(m))}
                                </div>
                                <div className="assignment hide" id="J_assignment">
                                    {ZQZR && ZQZR.map && ZQZR.map(m => this.RenderZQZRProductItems(m))}
                                </div>
                            </div>
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
                            <div className="billboard">
                                <div className="title"><span>{InvestmentRank.currentMonth}</span>月用户风云榜<b>统计不含散标直投</b>
                                </div>
                                <table><thead>
                                    <tr>
                                        <th width="30%">排名</th>
                                        <th width="30%">用户名</th>
                                        <th width="40%">出借金额</th>
                                    </tr></thead>
                                    <tbody>
                                        {InvestmentRank.items && InvestmentRank.items.map((m, i) => this.RenderInvestmentRankRow(m, i))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="news">
                                <div className="title" id="J_titleNews">
                                    <span className="menu active" tag="J_newsList">新闻动态</span>
                                    <span className="menu" tag="J_mediaList">媒体报道</span>
                                    <a href="/html/help/newsreport.html" className="more">更多</a>
                                </div>
                                <ul className="news-list" id="J_newsList">
                                    {News && News.map && News.map(m => <li key={Common.CreateGuid()}><a href={m.textHref}>{m.text}</a></li>)}
                                </ul>
                                <ul className="media-list hide" id="J_mediaList">
                                    {Media && Media.map && Media.map(m => <li key={Common.CreateGuid()}><a href={m.textHref}>{m.text}</a></li>)}
                                </ul>
                            </div>
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
                    <div className="partner" id="J_partner">
                        <div className="title">合作伙伴</div>
                        <i className="left"></i>
                        <i className="right"></i>
                        <div className="wrap-partner">
                            <ul>
                                {Partner && Partner.map && Partner.map(m => <li key={Common.CreateGuid()}><div><a href={m.textHref} target="_blank"><img src={m.extendUrl} /></a></div><a href={m.textHref}>{m.text}</a></li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="partner">
                        <div className="title">了解更多</div>
                        <ul className="ml-75">
                            {More && More.map && More.map(m => <li key={Common.CreateGuid()}><div><a href={m.textHref} target="_blank"><img src={m.extendUrl} /></a></div><a href={m.textHref}>{m.text}</a></li>)}
                        </ul>
                    </div>
                </div>
                <Footer PcBuildUrl={PcBuildUrl} Link={Link} Page={this} />
                {TipList}
                {DialogList}
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = {
        Loading: state.BizService.Loading || state.TradeCenterService.Loading || state.UserCenterService.Loading || state.InvestmentService.Loading,
        Link: state.BizService.Link,
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
        YYP: state.TradeCenterService.YYP,
        UserInfo: state.UserCenterService.UserInfo,
        InvestStatus: state.InvestmentService.InvestStatus
    };

    console.log(props);
    return props;
}

Index.Actions = {
    BizService: ["GetLink", "GetAd", "GetAchievement", "GetAnnouncement", "GetNews", "GetMedia", "GetInvestmentRank", "GetPartner", "GetMore"],
    TradeCenterService: ["GetZQZR", "GetSBZT", "GetThirtyTender", "GetYJDJ", "GetXYB", "GetYYP"],
    UserCenterService: ["GetUserInfo"],
    InvestmentService: ["InvestStatus"]
};

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Index);