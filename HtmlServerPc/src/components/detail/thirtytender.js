import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";
import Header from "../common/header";
import Footer from "../common/footer";
import { Common } from "UtilsCommon";

class ThirtyTender extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/mods/detail/thirtytender/_.css"];
    }

    GetJsList() {
        return ["/build/js/common/require.min.js", "/build/mods/detail/thirtytender/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetThirtyTender");
    }

    RenderThirtyTenderRecordRow(item, index) {
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
                        <a href="//www.xinxindai.com/">首页</a> &gt; <b>我要出借</b> &gt; <b>新元宝（新手专享）</b>
                    </div>
                </div>
                <div className='container clearfix'>
                    <div className='product-info clearfix'>
                        <div className='main-product'>
                            <p className='title'>{globalData.detailThirtyTender.data.name}、限投1次</p>
                            <table>
                                <tr>
                                    <td className='rate'>{globalData.detailThirtyTender.data.apr}%
                            {globalData.detailThirtyTender.data.floatApr !== 0 && <div>
                                            +{globalData.detailThirtyTender.data.floatApr}%
                                <p className='new-hot xszx-tip'>
                                                新手专享加息
                                    <i></i>
                                            </p>
                                        </div>}
                                    </td>
                                    <td>{globalData.detailThirtyTender.data.period}<span>个月</span></td>
                                    <td>{globalData.detailThirtyTender.data.lowestTender}<span>元</span></td>
                                </tr>
                                <tr>
                                    <th>历史年化收益</th>
                                    <th>后可申请转让</th>
                                    <th>起投金额</th>
                                </tr>
                            </table>
                            <p>
                                加入上限：<span>{Common.ToCurrency(globalData.detailThirtyTender.data.mostTender)}</span>元
                            </p>
                            <p className='new-tip'>注：新手专享加息奖励每个账户仅限1次</p>
                            <p>合同范本：<a href={'/commpd/agree/XSCP30T_agree_' + globalData.detailThirtyTender.data.id + '.html?productSign=XSCP30T'}>《新元宝（新手专享）服务协议》</a></p>
                            <p>募集成功后次日开始计息</p>
                        </div>
                        <div className='detail-focus'>
                            {!globalData.isLogin && <p>账户余额：<a className='tologin'>登录</a>后可见</p>}
                            {globalData.isLogin && <p>
                                账户余额：{Common.ToCurrency(globalData.detailThirtyTender.data.usable)} <a
                                    href='/usercenter/recharge.html' id="recharge">充值</a></p>}
                            <div className='J_noCondition'>
                                <p>加入金额：（{globalData.detailThirtyTender.data.step}的整数倍递增）</p>
                                <div className='money' id="J_money">
                                    <button type='button' value='500'
                                        className={globalData.detailThirtyTender.data.mostTender > 500 ? '' : 'disable'}>500元
                        </button>
                                    <button type='button' value='800'
                                        className={globalData.detailThirtyTender.data.mostTender > 800 ? '' : 'disable'}>800元
                        </button>
                                    <button type='button' value='1000'
                                        className={globalData.detailThirtyTender.data.mostTender > 1000 ? '' : 'disable'}>
                                        1000元
                        </button>
                                    <button type='button' value='3000'
                                        className={globalData.detailThirtyTender.data.mostTender > 3000 ? '' : 'disable'}>
                                        3000元
                        </button>
                                    <button type='button' value='5000'
                                        className={globalData.detailThirtyTender.data.mostTender > 5000 ? '' : 'disable'}>
                                        5000元
                        </button>
                                    <button type='button' value='8000'
                                        className={globalData.detailThirtyTender.data.mostTender > 8000 ? '' : 'disable'}>
                                        8000元
                        </button>
                                    <button type='button' value='10000'
                                        className={globalData.detailThirtyTender.data.mostTender > 10000 ? '' : 'disable'}>
                                        10000元
                        </button>
                                </div>
                                <p className='number-box clearfix' id="J_numberBox">
                                    <span xxd-sign="minus" className='add-subtract'>-</span>
                                    <input value={globalData.detailThirtyTender.data.lowestTender}
                                        onkeyup="value=value.replace(/[^\d]/g,'')" autocomplete="new-password" />
                                    <span xxd-sign="plus" className='add-subtract'>+</span>
                                </p>
                                <p>历史收益：<span id="J_income">0</span>元</p>
                                <p><i></i>资金由存管银行全程监控</p>
                                <p className='risk-protocol hide'><input type="checkbox" />我已充分阅读本<a target='_blank' href="/user/regRiskWarning.html">《资金出借风险提示函》</a>，知晓包括债权转让风险在内的相关风险提示，并将根据风险承受能力谨慎出借并承担风险。
                                </p>
                                <p className="error-tip hide">错误提示</p>
                                <div id="J_buyWrap">
                                    {!globalData.isLogin && <a className='btn tologin'>立即登录</a>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="count-rate">
                        <ul>
                            <li><a href="#">计划示意图</a></li>
                        </ul>
                        <div className="rate-img">
                            <img src={PcBuildUrl + 'img/thirtytender_img@2x.png'} />
                        </div>



                    </div>
                    <div className='product-tabs'>
                        <ul className='nav' id="J_tabs">
                            <li className='active pro-info'><a href="#">服务介绍</a></li>
                            <li className='in-record'><a
                                href="#">加入记录<span>（{globalData.thirtyTenderRecord.data.totalCount}）</span></a>
                            </li>
                            <li className='debenture'><a href="#">债权列表</a></li>
                            <li className='problems'><a href="#">常见问题</a></li>
                            <li className='risk'><a href="#">风险提示</a></li>
                        </ul>
                        <div className='content'>
                            <div className='j_tabContent detail-desc'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th className='title'>名称</th>
                                            <td className='title'>新元宝（新手专享）</td>
                                        </tr>
                                        <tr>
                                            <th className="infor">服务介绍</th>
                                            <td className="infor-con">
                                                新元宝（新手专享）是新元宝计划系列中专门针对新手推出的一种福利计划，未曾在新新贷投标过的用户均有一次机会参与，仅限首次加入。 <br />
                                                该服务计划在用户认可的标的范围内，对符合要求的标的进行自动投标，服务期结束后，用户可申请债权转让退出，债权转让完成后所获相应本金利息及新手专享加息补贴，将返至您新新贷账户的“可用余额”。服务期结束至债权转让成功期间，该服务计划不计息。
                            </td>
                                        </tr>
                                        <tr>
                                            <th>服务期</th>
                                            <td>{globalData.detailThirtyTender.data.period}个月</td>
                                        </tr>
                                        <tr>
                                            <th className='h90'>历史年化收益率</th>
                                            <td className='h90'>
                                                {globalData.detailThirtyTender.data.floatApr > 0 ? <div>
                                                    {globalData.detailThirtyTender.data.apr}%
                                    <div className="plus">+{globalData.detailThirtyTender.data.floatApr}%
                                        <p className='new-hot xszx-tip'>
                                                            新手专享加息
                                            <i></i>
                                                        </p>
                                                    </div>
                                                </div>
                                                    : <div>
                                                        {globalData.detailThirtyTender.data.apr}%
                                </div>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>加入条件</th>
                                            <td><b>未曾在新新贷投标过的新用户，仅限参与一次</b></td>
                                        </tr>
                                        <tr>
                                            <th>加入规则</th>
                                            <td><b>100元起投，并以100元倍数递增，上限10000元</b></td>
                                        </tr>
                                        <tr>
                                            <th>退出方式</th>
                                            <td className="quit-con">服务期内不支持提前退出。服务期结束后由出借人手动申请退出进行债权转让，具体时长视债权转让交易情况而定。债权成功转让后资金返至出借人的新新贷账户中，并可在账户的“可用余额”查询。</td>
                                        </tr>
                                        <tr>
                                            <th>收益计算规则</th>
                                            <td>
                                                {globalData.detailThirtyTender.data.floatApr > 0 ? <b>
                                                    历史收益=加入金额*{globalData.detailThirtyTender.data.apr}%/12 +
                                    加入金额*{globalData.detailThirtyTender.data.floatApr}%/12
                                </b>
                                                    : <b>
                                                        历史收益=加入金额*{globalData.detailThirtyTender.data.apr}%/12
                                </b>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>费用</th>
                                            <td>
                                                加入费用0元 <br />
                                                退出费用0元
                            </td>
                                        </tr>
                                        <tr>
                                            <th>服务协议</th>
                                            <td><a target="_blank" href={'/commpd/agree/XSCP30T_agree_' + globalData.detailThirtyTender.data.id + '.html?productSign=XSCP30T'}>《新元宝（新手专享）服务协议》</a></td>
                                        </tr>
                                    </tbody>
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
                                    {globalData.thirtyTenderRecord.data.items.map((m, i) => this.RenderThirtyTenderRecordRow(m, i))}
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
                            <div className='j_tabContent ask-answer hide'>
                                <h6>1.我为什么无法出借新元宝（新手专享）？</h6>
                                <p>新元宝（新手专享）仅针对未在新新贷平台出借过的新用户，且每位用户只能参与一次。</p>
                                <h6>2.新元宝（新手专享）产品可以使用红包吗？</h6>
                                <p>不可以。红包仅限用于新元宝等普通产品，请详见红包使用说明。</p>
                                <h6>3.新元宝（新手专享）如何退出？</h6>
                                <p>服务期内不支持提前退出。服务期结束后由出借人手动申请退出进行债权转让，具体时长视债权转让交易情况而定。债权成功转让后资金返至出借人的新新贷账户中，并可在账户的“可用余额”查询。</p>
                            </div>
                            <div className='j_tabContent risk-warning hide' dangerouslySetInnerHTML={{ __html: globalData.projectRiskText }}>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData}  />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.ThirtyTender
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(ThirtyTender);