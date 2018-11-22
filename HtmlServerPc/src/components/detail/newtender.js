import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";
import Header from "../common/header";
import Footer from "../common/footer";
import { Common } from "UtilsCommon";

class NewTender extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/mods/detail/newTender/_.css"];
    }

    GetJsList() {
        return ["/build/js/common/require.min.js", "/build/mods/detail/newTender/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetNewTender");
    }

    RenderXSBRecordRow(item, index) {
        return (
            <tr key={Common.CreateGuid()}>
                <td>{index + 1}</td>
                <td>{item.userName}</td>
                <td>{item.account}</td>
                <td><span>{Common.DateFormat(item.addTime, "yyyy-MM-dd HH:mm:ss")}</span></td>
            </tr>
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
                        <a href="//www.xinxindai.com/">首页</a> &gt; <b>我要出借</b> &gt; <b>新手标</b>
                    </div>
                </div>

                <div className='container'>
                    <div className='product-info clearfix'>
                        <div className='main-product'>
                            <p className='title'>{globalData.detailXSB.data.name}<span>{globalData.detailXSB.data.releasePeriodCount}期</span></p>
                            <table>
                                <tr>
                                    <td><span>{Common.ToCurrency(globalData.detailXSB.data.account)}</span>元</td>
                                    <td className='rate'>{globalData.detailXSB.data.apr}%</td>
                                    <td className='last'>{globalData.detailXSB.data.period}个月</td>
                                </tr>
                                <tr>
                                    <th>计划金额</th>
                                    <th>历史年化收益率</th>
                                    <th className='last'>后可申请转让</th>
                                </tr>
                            </table>
                            <p>起息时间：募集成功后次日开始计息<span className='buyTip'>加入规则：{globalData.detailXSB.data.lowestTender}元起投，加入上限{Common.ToCurrency(globalData.detailXSB.data.mostTender)}元</span></p>
                            <p>退出方式：{globalData.detailXSB.data.period}个月后用户可申请债权转让退出</p>
                            <p className='new-tip'>*仅限未曾在新新贷投标过的用户加入，每位用户限参与1次</p>
                        </div>
                        <div className='new-tender-focus'>
                            {!globalData.isLogin && <p>剩余金额：<a className='tologin'>登录</a>后可见</p>}
                            {globalData.isLogin && <p>剩余金额：{Common.ToCurrency(globalData.detailXSB.data.remAccount)}元</p>}
                            {globalData.isLogin && <p>账户余额：{Common.ToCurrency(globalData.detailXSB.data.usable)}<a href='/usercenter/recharge.html' id="recharge">充值</a></p>}
                            <p className='in-copies'>加入金额：<input className='copies' id='J_numberBox' value={globalData.detailXSB.data.lowestTender} onkeyup="value=value.replace(/[^\d]/g,'')" autocomplete="new-password" /></p><span className='more'>元</span>
                            <p className='new-tender-color'>加入金额为{globalData.detailXSB.data.step}元的整数倍递增</p>
                            <p>历史收益：<span className='income' id="J_income">0.00</span>元</p>
                            <p className='hide new-hand-tip'>新手标只针对新注册且未进行过投标的用户开放，感谢您的关注，请关注其他产品。</p>
                            <p className='risk-protocol hide'><input type="checkbox" />我已充分阅读本<a target='_blank' href="/user/regRiskWarning.html">《资金出借风险提示函》</a>，知晓包括债权转让风险在内的相关风险提示，并将根据风险承受能力谨慎出借并承担风险。</p>
                            <p className="error-tip hide">错误提示</p>
                            <div id="J_buyWrap">
                                {!globalData.isLogin && <a className='btn tologin'>立即登录</a>}
                            </div>
                        </div>
                    </div>
                    <div className='plan'>
                        <p className='title'>计划示意图</p>
                        {globalData.detailXSB.data.period === '1' && <div>
                            <img src={PcBuildUrl + 'img/newtender_1m@2x.png'} />
                        </div>}
                        {globalData.detailXSB.data.period === '3' && <div>
                            <img src={PcBuildUrl + 'img/newtender_3m@2x.png'} />
                        </div>}
                    </div>
                    <div className='product-tabs'>
                        <ul className='nav' id="J_tabs">
                            <li className='active pro-info'><a href="#">服务介绍</a></li>
                            <li className='in-record'><a href="#">加入记录<span>（{globalData.XSBRecord.data.totalCount}）</span></a></li>
                            <li className='debenture'><a href="#">债权列表</a></li>
                            <li className='risk'><a href="#">风险提示</a></li>
                        </ul>
                        <div className='content'>
                            <div className='j_tabContent detail-desc-tender'>
                                <table>
                                    <tr>
                                        <th>名称</th>
                                        <td>{globalData.detailXSB.data.name} - {globalData.detailXSB.data.releasePeriodCount}期</td>
                                    </tr>
                                    <tr>
                                        <th className='infor'>服务介绍</th>
                                        <td className='infor-con'>新手标是新元宝计划系列中专门针对新手推出的一种福利计划，未曾在新新贷投标过的用户均有一次机会参与，仅限首次加入。该服务计划在用户认可的标的范围内，对符合要求的标的进行自动投标，服务期结束后，用户可申请债权转让退出，债权转让完成后所获相应本金利息，将返至您新新贷账户的“可用余额”。服务期结束至债权转让成功期间，该服务计划不计息。
                            </td>
                                    </tr>
                                    <tr>
                                        <th>起息时间</th>
                                        <td>募集成功后次日起息</td>
                                    </tr>
                                    <tr>
                                        <th>服务期</th>
                                        <td>{globalData.detailXSB.data.period}个月</td>
                                    </tr>
                                    <tr>
                                        <th>退出方式</th>
                                        <td className="quit-con">服务期内不支持提前退出。服务期结束后由出借人手动申请退出进行债权转让，具体时长视债权转让交易情况而定。债权成功转让后资金返至出借人的新新贷账户中，并可在账户的“可用余额”查询。</td>
                                    </tr>
                                    <tr>
                                        <th>加入条件</th>
                                        <td>未曾在新新贷投标过的新用户，仅限参与一次</td>
                                    </tr>
                                    <tr>
                                        <th>加入规则</th>
                                        <td>{globalData.detailXSB.data.lowestTender}元起投，加入上限{Common.ToCurrency(globalData.detailXSB.data.mostTender)}元</td>
                                    </tr>
                                    <tr>
                                        <th>是否使用新手红包</th>
                                        {globalData.detailXSB.data.useRedenvelope === 'N' && <td>否</td>}
                                        {globalData.detailXSB.data.useRedenvelope === 'Y' && <td>是</td>}
                                    </tr>
                                    <tr>
                                        <th>费用</th>
                                        <td>
                                            <span>加入费用：<i>0.00%</i></span>
                                            <span>退出费用：<i>0.00%</i></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>服务协议</th>
                                        <td><a target='_blank' className='productSign'>《新手标服务协议》</a></td>
                                    </tr>
                                </table>
                            </div>
                            <div className='j_tabContent table-content hide'>
                                <table id="J_tableRecord">
                                    <tr>
                                        <th>序号</th>
                                        <th>出借人</th>
                                        <th>加入金额</th>
                                        <th>加入时间</th>
                                    </tr>
                                    {globalData.XSBRecord.data.items.map((m, i) => this.RenderXSBRecordRow(m, i))}
                                </table>
                                <div className='pagination table-page'>

                                </div>
                            </div>
                            <div className='j_tabContent debenture-money hide'>
                                <p>近期借款项目（您的资金将可能出借到以下任意一个或多个项目中，您可在出借后前往我的新新贷-出借管理查询详细的匹配记录。）</p>
                                <table id="J_debenture">
                                    <tr>
                                        <th>项目名称</th>
                                        <th>借款金额</th>
                                        <th>借款利率</th>
                                        <th>借款期限</th>
                                    </tr>
                                </table>
                                <div className='pagination debenture-page'>

                                </div>
                            </div>
                            <div className='j_tabContent risk-warning hide' dangerouslySetInnerHTML={{ __html: globalData.projectRiskText }}>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData}  />
            </div >
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.NewTender
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(NewTender);