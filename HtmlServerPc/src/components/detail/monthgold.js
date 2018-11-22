import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";
import Header from "../common/header";
import Footer from "../common/footer";
import { Common } from "UtilsCommon";

class Monthgold extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/mods/detail/monthgold/_.css"];
    }

    GetJsList() {
        return ["/build/js/common/require.min.js", "/build/mods/detail/monthgold/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetMonthgold");
    }

    RenderYJDJRecordRow(item) {
        return (
            <tr key={Common.CreateGuid()}>
                <td>{itemStat.count}</td>
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
                        <a href="//www.xinxindai.com/">首页</a> &gt; <b>我要出借</b> &gt; <b>月进斗金</b>
                    </div>
                </div>

                <div className='container clearfix'>
                    <div className='product-info clearfix'>
                        <div className='main-product'>
                            <p className='title'>{globalData.detailYJDJ.data.name}<span>-{globalData.detailYJDJ.data.releasePeriodCount}期 ( 每天10:00、20:00发售 )</span></p>
                            <table>
                                <tr>
                                    <td className='rate month-color'>{globalData.detailYJDJ.data.apr}%</td>
                                    <td>{globalData.detailYJDJ.data.period}<span>天</span></td>
                                    <td>{globalData.detailYJDJ.data.lowestTender}<span>元</span></td>
                                    {globalData.detailYJDJ.data.status === 3
                                        ? <td className='money'>0<span>元</span></td>
                                        : <td className='money'>{Common.ToCurrency(globalData.detailYJDJ.data.remAccount)}<span>元</span></td>
                                    }
                                </tr>
                                <tr>
                                    <th align='left'>历史年化收益</th>
                                    <th align='left'>后可申请转让</th>
                                    <th align='left'>起投金额</th>
                                    <th align='left'>剩余额度</th>
                                </tr>
                            </table>
                            <div className='some-tip'>
                                <p>开放总额：<span>{Common.ToCurrency(globalData.detailYJDJ.data.account)}</span>元</p>
                                <p>加入上限：<span>{Common.ToCurrency(globalData.detailYJDJ.data.mostTender)}</span>元</p>
                                <p>起息时间：募集成功后开始计息</p>
                            </div>
                            <div id='J_countDown' className='clearfix'></div>
                        </div>
                        <div className='detail-focus'>

                            {globalData.isLogin
                                ? <p>账户余额：{Common.ToCurrency(globalData.detailYJDJ.data.usable)} <a href='/usercenter/recharge.html' id="recharge">充值</a></p>
                                : <p>账户余额：<a className='tologin'>登录</a>后可见</p>
                            }
                            <p>加入金额：（{globalData.detailYJDJ.data.step}的整数倍递增）</p>
                            <div className='money' id="J_money">
                                <button type='button' value='500' className={globalData.detailYJDJ.data.maxAmount > 500 ? '' : 'disable'}>500元</button>
                                <button type='button' value='800' className={globalData.detailYJDJ.data.maxAmount > 800 ? '' : 'disable'}>800元</button>
                                <button type='button' value='1000' className={globalData.detailYJDJ.data.maxAmount > 1000 ? '' : 'disable'}>1000元</button>
                                <button type='button' value='2000' className={globalData.detailYJDJ.data.maxAmount > 2000 ? '' : 'disable'}>2000元</button>
                                <button type='button' value='3000' className={globalData.detailYJDJ.data.maxAmount > 3000 ? '' : 'disable'}>3000元</button>
                            </div>
                            <p className='number-box clearfix' id="J_numberBox">
                                <span xxd-sign="minus" className='add-subtract'>-</span>
                                <input value={globalData.detailYJDJ.data.lowestTender} onkeyup="value=value.replace(/[^\d]/g,'')" autocomplete="new-password" />
                                <span xxd-sign="plus" className='add-subtract'>+</span>
                            </p>
                            <p>历史收益：<span id="J_income" className="month-color">0</span>元</p>
                            {globalData.isLogin && <p>您的个人剩余可投额度：<span className='limit month-color'>{Common.ToCurrency(globalData.detailYJDJ.data.maxAmount)}</span>元</p>}
                            <p><i></i>资金由存管银行全程监控</p>
                            <p className='risk-protocol hide'><input type="checkbox" />我已充分阅读本<a target='_blank' href="/user/regRiskWarning.html">《资金出借风险提示函》</a>，知晓包括债权转让风险在内的相关风险提示，并将根据风险承受能力谨慎出借并承担风险。</p>
                            <p className="error-tip hide">错误提示</p>
                            <div id="J_buyWrap">
                                {!globalData.isLogin && <a className='btn month-btn tologin'>立即登录</a>}
                            </div>
                        </div>

                    </div>
                    <div className="count-rate">
                        <ul>
                            <li><a href="#">计划示意图</a></li>
                        </ul>
                        <div className="rate-img">
                            <img src={PcBuildUrl + 'img/monthGold_img@2x.png'} />
                        </div>
                    </div>
                    <div className='product-tabs'>
                        <ul className='nav' id="J_tabs">
                            <li className='active pro-info'><a href="#">服务介绍</a></li>
                            <li className='in-record'><a href="#">加入记录<span>（{globalData.YJDJRecord.data.totalCount}）</span></a></li>
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
                                            <td className='title'>{globalData.detailYJDJ.data.name}<span>-{globalData.detailYJDJ.data.releasePeriodCount}期</span></td>
                                        </tr>
                                        <tr>
                                            <th className="infor">服务介绍</th>
                                            <td className="infor-con">
                                                月进斗金是新新贷推出的一种限时发售计划，每日10：00、20：00限时发售，售完即止。 <br />
                                                该服务计划在用户认可的标的范围内，对符合要求的标的进行自动投标，服务期结束后，用户可申请债权转让退出，债权转让完成资金将返至您新新贷账户的“可用余额”。服务期结束至债权转让成功期间，该服务计划不计息。
                                    </td>
                                        </tr>
                                        <tr>
                                            <th>开放加入时间</th>
                                            <td>每日10:00-14:00 20:00-23:59</td>
                                        </tr>
                                        <tr>
                                            <th>服务期</th>
                                            <td>{globalData.detailYJDJ.data.period}天</td>
                                        </tr>
                                        <tr>
                                            <th>历史年化收益率</th>
                                            <td>{globalData.detailYJDJ.data.apr}%</td>
                                        </tr>
                                        <tr>
                                            <th>收益计算</th>
                                            <td>
                                                <b>
                                                    历史收益=加入金额*{globalData.detailYJDJ.data.apr}%/360*31
                                        </b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>加入条件</th>
                                            <td>加入金额{globalData.detailYJDJ.data.lowestTender}元起，并以{globalData.detailYJDJ.data.lowestTender}元的整数倍递增</td>
                                        </tr>
                                        <tr>
                                            <th>单账户加入额度</th>
                                            <td className="infor-con">{Common.ToCurrency(globalData.detailYJDJ.data.mostTender)}元，不限制加入次数。如果加入金额达到上限，可等待服务期结束申请退出后，资金回到新新贷账户中，个人可加入额度释放，继续加入</td>
                                        </tr>
                                        <tr>
                                            <th>退出方式</th>
                                            <td className="infor-con">服务期内不支持提前退出。服务期结束后由出借人手动申请退出进行债权转让，具体时长视债权转让交易情况而定。债权成功转让后资金返至出借人的新新贷账户中，并可在账户的“可用余额”查询。</td>
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
                                            <td><a target="_blank" id="monthgoldAgree">《月进斗金服务协议》</a></td>
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
                                    {globalData.YJDJRecord.data.items.map(m => this.RenderYJDJRecordRow(m))}
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
                                <h6>1.月进斗金如何退出？</h6>
                                <p>月进斗金服务期内不支持提前退出。您在服务期结束后由出借人手动申请退出进行债权转让，具体时长视债权转让交易情况而定。债权成功转让后资金返至出借人的新新贷账户中，并可在账户的“可用余额”查询。</p>
                                <h6>2.我已经加入了月进斗金1000元，还能继续加入吗？</h6>
                                <p>可以，月进斗金单账户加入上限为3000元，可以加入多次。如果加入金额达到上限，可等待服务期结束申请退出后，资金回到新新贷账户中，个人可加入额度释放，继续加入。</p>
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
        PageData: state.PageView.Monthgold
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Monthgold);