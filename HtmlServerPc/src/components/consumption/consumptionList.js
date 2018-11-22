import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";
import Header from "../common/header";
import Footer from "../common/footer";
import { Common } from "UtilsCommon";

class ConsumptionList extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "散标直投_新宜贷";
    }

    GetCssList() {
        return ["/build/mods/detail/consumptionList/_.css"];
    }

    GetJsList() {
        return ["/build/js/common/require.min.js", "/build/mods/detail/consumptionList/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetConsumptionList");
    }

    RenderConsumptionItem(item) {
        return (
            <div className="consumption-list" key={Common.CreateGuid()}>
                <div className='list clearfix'>
                    <div className='list-infomation'>
                        <div className='account-img f-left'>
                            <div className={'img-bg grade' + item.riskGrade}>
                                <p>新新贷根据内部风控部门制定的风险定价策略，将借款项目按从低到高分为 A1-A2-A3-B-C 5个风险评级，不同的风险评级将对应不同的借款利率及风险，请您谨慎选择<i></i></p>
                            </div>
                        </div>
                        <div className='list-focus f-left'>
                            <h4><a href={'/detail/consumption/' + item.bidCode + '.html'} target='_blank'>{item.bidName}</a><span className='consumption-icon'><i><b></b></i>新宜贷</span></h4>
                            <p>历史年化收益：<span className='annualized-returns'>{Common.ToCurrency(item.plannedAnnualRate)}</span><i>%</i></p>
                            <p className='time-limit'>期限：<span className='limit-month'>{item.leastPeriodValue}</span>个月</p>
                        </div>
                    </div>
                    <div className='f-left consumption-detail'>
                        <p className='surplus'>剩余：<span>{Common.ToCurrency(item.leftTenderAmount)}</span>元</p>
                        <div className='progress-bar'>
                            <div className='existing'>{Common.ToCurrency(Common.GetIntValue(((item.bidAmount - item.leftTenderAmount) * 1.0) / item.bidAmount * 100), false)}</div>
                        </div>
                        <p>借款金额：<span>{Common.ToCurrency(item.bidAmount)}</span>元</p>
                        <div>
                            {item.status.code === "BIDDING" && <a href={'/detail/consumption/' + item.bidCode + '.html'} target="_blank" className='purchase'>立即加入</a>}
                            {item.status.code === "*" && <a href="javascript:;" className='purchase no-purchase'>已抢光</a>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData } = this.props.PageData;

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} />

                <div className="detail-crumbs">
                    <div className="crumbs">
                        <a href="//www.xinxindai.com/">首页</a> &gt; <b>新宜贷</b>
                    </div>
                </div>

                <div className='container'>
                    <h3>新宜贷<span><i></i>资金由存管银行全程监控</span></h3>
                    <div className='main-product'>
                        <div className='main-catalogue'>
                            <p className="borrow-item">近期借款项目</p>
                            <div className='catalogue clearfix'>
                                <div className='pagination page-catalogue'>

                                </div>
                            </div>
                        </div>
                        <div className='consumption'>
                            {globalData.bids.data.items.map(m => this.RenderConsumptionItem(m))}
                            <div className='pagination consumption-page'>
                            </div>
                        </div>
                    </div>
                    <div className='consumption-tabs'>
                        <ul className='clearfix nav' id='consumptionNav'>
                            <li className='active problems-btn'><a href="javascript:;">常见问题</a></li>
                        </ul>
                        <div className='tab-content' id='tab-content'>
                            <div className='j_tabContent tab-desc ask-answer'>
                                <ul className='clearfix'>
                                    <li><a href="/help/notice.html#help_0" target='_blank'>投标后可以提前赎回吗？</a></li>
                                    <li><a href="/help/notice.html#help_1" target='_blank'>什么是自动投标?</a></li>
                                    <li><a href="/help/notice.html#help_2" target='_blank'>提现的时间是怎样安排的？</a></li>
                                    <li><a href="/news/newsList/story.html" target='_blank'>新新贷出借人的故事</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.ConsumptionList
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(ConsumptionList);