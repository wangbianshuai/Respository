import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";
import Header from "../common/header";
import Footer from "../common/footer";
import { Common } from "UtilsCommon";

class ConsumptionDetail extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "散标直投_新宜贷";
    }

    GetCssList() {
        return ["/build/mods/detail/consumptionDetail/_.css"];
    }

    GetJsList() {
        return ["/build/js/common/require.min.js", "/build/mods/detail/consumptionDetail/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetConsumptionDetail", { bidCode: ctx.params.bidCode });
    }

    RenderPbocInfoRow(item) {
        return (
            <tr key={Common.CreateGuid()}>
                <td>{item.creditType === "1" ? "信用卡" : item.creditType === "2" ? "购房贷款" : "其他贷款"}</td>
                <td>{item.accountNum}</td>
                <td>{item.osAccountNum}</td>
                <td>{item.overdueAccountNum}</td>
                <td>{item.overdue90AccountNum}</td>
                <td>{item.guaranteeNum}</td>
            </tr>
        )
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData } = this.props.PageData;
        const show = globalData.infoDisclosures.code === "200000";

        return (<div id="J_wrapBody">
            <Header PcBuildUrl={PcBuildUrl} globalData={globalData} />

            <div className="detail-crumbs">
                <div className="crumbs">
                    <a href="//www.xinxindai.com/">首页</a> &gt; <b>新宜贷</b> &gt; <b>标的详情</b>
                </div>
            </div>
            <div className='container'>
                <h2>{globalData.bidDetail.data.bidName}&nbsp;&nbsp;&nbsp;借款编号：{globalData.bidDetail.data.bidCode} <a
                    href="/detail/consumptionList.html">返回标的列表</a></h2>
                <div className='loan-container'>
                    <div className='loan clearfix'>
                        <div className='loan-focus'>
                            <table>
                                <tr>
                                    <th>借款金额</th>
                                    <th>历史年化收益<p className='yearReturns-tip'>?<span>历史年化收益率是指参考同类型项目的历史数据得出的收益率<i></i></span></p></th>
                                    <th>借款期限</th>
                                </tr>
                                <tr>
                                    <td>
                                        <span><i id='borrowMoney'>{Common.ToCurrency(globalData.bidDetail.data.bidAmount)}</i>元</span>
                                    </td>
                                    <td><span id='tableEarnings'>{Common.ToCurrency(globalData.bidDetail.data.plannedAnnualRate)}</span>%
                              </td>
                                    <td><span id='leastPeriod'>{globalData.bidDetail.data.leastPeriodValue}</span>个月</td>
                                </tr>
                            </table>
                            <div className='consumption-icon'><i><b></b></i>新宜贷</div>
                            <p>
                                <em>借款用途：{globalData.bidDetail.data.loanPurpose.message}</em>
                                <span>还款方式：<i id='modeRepay'>{globalData.bidDetail.data.repaymentType.message}</i></span>
                                {globalData.bidDetail.data.repaymentType.code === "001" && <em className='modeRepay-tip'>?
                                 <span>
                                        每月应还本息=[借款金额×历史年化收益÷12×（1+历史年化收益÷12）^借款期限]÷[（1+历史年化收益÷12）^借款期限－1] 。应还总利息为每月应还利息总合。应还本金为借款金额。
                                  <i></i>
                                    </span>
                                </em>}
                            </p>
                            <p>
                                <em>最低投标：{Common.ToCurrency(globalData.bidDetail.data.tenderAmountDown)}元</em><span>债权转让：{globalData.bidDetail.data.isSupportCreditAssignment.message}</span>
                            </p>
                            <p><em>投标奖励：无</em><span>投标且复审成功后可获得奖励</span></p>
                            <p><em>标的状态：{globalData.bidDetail.data.status.message}</em><span>预计起息时间：{globalData.bidDetail.data.plannedValueDate}</span></p>
                            <p><em>风险等级：{globalData.bidDetail.data.riskGrade}</em><span>募集截止日期：{globalData.bidDetail.data.endTime}</span></p>
                        </div>
                        <div className='available-balance'>
                            <h3>剩余可投金额</h3>
                            <span className='rem-amount'><i id='remAmount'>{Common.ToCurrency(globalData.bidDetail.data.leftTenderAmount)}</i>元</span>
                            <div className='progress-tip'>
                                <span>进度：<i>{globalData.bidDetail.data.percent}</i>%</span>
                                <div className='progress-bar'>
                                    <div className='existing' style={{ width: globalData.bidDetail.data.percent + '%' }}></div>
                                </div>
                            </div>
                            {globalData.isLogin && <div className='account-balance '>
                                <span>账户余额：<i id='accountBalance'>{Common.ToCurrency(globalData.overview.data.availableBalance)}</i>元</span>
                                <a href='/usercenter/recharge.html'>充值</a>
                                <a id='allInvest'>全投</a>
                            </div>}
                            <p>投标金额：<input type="text" placeholder={globalData.bidDetail.data.tenderAmountDown + '元起投'} id='investMoney' />元</p>
                            <p>平均历史收益：<span id='earnings'>0.00</span>元</p>
                            <p className='risk-protocol hide'><input type="checkbox" />我已充分阅读本<a target='_blank'
                                href="/user/regRiskWarning.html">《资金出借风险提示函》</a>，知晓包括债权转让风险在内的相关风险提示，并将根据风险承受能力谨慎出借并承担风险。
                      </p>
                            <p className='error-tip hide'></p>
                            <div id='J_buyWrap'>
                                {!globalData.isLogin && <a className='button' href='/user/ilogin.html'>立即登录</a>}
                                {globalData.isLogin && <a className='button' id='toBid'>立即加入</a>}
                            </div>
                        </div>
                    </div>
                    <div className='loan-info'>
                        <div dangerouslySetInnerHTML={{ __html: globalData.bidDetail.data.expenseExplanation }}></div>
                        <p>合同范本：<a href="/html/commitment/index.html" target='_blank'>查看详情</a></p>
                    </div>
                </div>
                <div className='consumption-tabs'>
                    <ul className='clearfix nav' id='consumptionNav'>
                        <li className='active details-btn'><a href="javascript:;">借款详情</a></li>
                        <li className=''><a href="javascript:;">还款记录</a></li>
                        <li className=''><a href="javascript:;">投标记录</a></li>
                        <li className=''><a href="javascript:;">安全保障</a></li>
                        <li className=''><a href="javascript:;">项目风险提示</a></li>
                    </ul>
                    <div className='tab-content' id='tab-content'>
                        <div className='j_tabContent tab-desc loan-details '>
                            {!globalData.isLogin && <p className='login-tip '>只有 <a href="/user/iregister.html">注册</a>
                                用户才可以查看借款人详细信息！现在 <a href="/user/ilogin.html">登录</a></p>}
                            {globalData.isLogin && <div className='borrower-details'>
                                <h6>借款人详情</h6>
                                <div>
                                    <p><span>借款人姓名：{globalData.bidBorrowerInfo.data.realname}</span><span>身份证号码：{globalData.bidBorrowerInfo.data.idCardNo}</span>
                                    </p>
                                    <p><span>借款人主体: 自然人</span><span>年龄：{globalData.bidBorrowerInfo.data.age} 岁</span>
                                    </p>
                                    <p><span>性别：{globalData.bidBorrowerInfo.data.gender}</span><span>所在地：{globalData.bidBorrowerInfo.data.location} </span>
                                    </p>
                                    <p><span>所属行业：{globalData.infoDisclosures.data.industry}</span><span>工作性质：{globalData.infoDisclosures.data.workType}</span>
                                    </p>
                                    <p><span>收入情况：{globalData.infoDisclosures.data.incomeStr}</span><span>负债情况：{Common.IsNullOrEmpty(globalData.infoDisclosures.data.liabilityStr) ? '无重大负债' : globalData.infoDisclosures.data.liabilityStr}</span>
                                    </p>
                                </div>
                                <h6>借款相关</h6>
                                <div>
                                    <p><span>逾期次数：{globalData.bidBorrowerInfo.data.overdueCount}</span><span>逾期金额：{globalData.bidBorrowerInfo.data.overdueSumAmount}</span>
                                        <span>成功借款次数：{globalData.bidBorrowerInfo.data.successLoanNum}</span>
                                    </p>
                                </div>
                                <h6>征信报告</h6>
                                {Common.IsNoEmptyArray(globalData.infoDisclosures.data.pbocInfoList) ?
                                    <div className='credit'>
                                        <table>
                                            <tr>
                                                <th></th>
                                                <th>账户数</th>
                                                <th>未清算/未销户账户数</th>
                                                <th>发生逾期的账户数</th>
                                                <th>发生过90天以上逾期的账户数</th>
                                                <th>为他人担保笔数</th>
                                            </tr>
                                            {globalData.infoDisclosures.data.pbocInfoList.map(m => this.RenderPbocInfoRow(m))}

                                        </table>
                                    </div> : <div><p><span>借款人未提供</span></p></div>
                                }

                                <h6>借款描述</h6>
                                <p>{globalData.bidBorrowerInfo.data.bidInfo}</p>
                                {globalData.bidDetail.data.bidAmount <= 200000 && <div>
                                    <h6>在其他网络借贷平台借款情况</h6>
                                    <div dangerouslySetInnerHTML={{ __html: globalData.managementText }}></div>
                                </div>}
                                {show && globalData.bidDetail.data.status.code === 'REPAYING' && globalData.infoDisclosures.data.updateDate && <h6>其他相关信息（更新时间：{Common.DateFormat(globalData.infoDisclosures.data.updateDate, 'yyyy/MM/dd')}</h6>}
                                {show && globalData.bidDetail.data.status.code === 'REPAYING' && globalData.infoDisclosures.data.updateDate && <div className='others'>
                                    <p>资金运用情况：{globalData.infoDisclosures.data.fundsUse}</p>
                                    <p>借款人还款能力变化：{globalData.infoDisclosures.data.repaymentAbilityChange}</p>
                                    <p>借款人涉诉及受行政处罚情况：{globalData.infoDisclosures.data.complaintsAdmPenalties}</p>
                                </div>}
                            </div>}
                        </div>

                        <div className='j_tabContent tab-desc repayment-record hide'>
                            <div className='table-content '>
                                <table id="J_repaymentRecord">
                                    <tr>
                                        <th>期数</th>
                                        <th>待还日期</th>
                                        <th>实还日期</th>
                                        <th>已还金额</th>
                                        <th>待还金额</th>
                                        <th>状态</th>
                                    </tr>
                                </table>
                                <div className='pagination repayment-page'></div>
                            </div>
                        </div>
                        <div className='j_tabContent tab-desc tender-record hide'>
                            <div className='table-content '>
                                <table id="J_tenderRecord">
                                    <tr>
                                        <th>投标人</th>
                                        <th>投标金额</th>
                                        <th>投标时间</th>
                                        <th>状态</th>
                                    </tr>
                                </table>
                                <div className='pagination tenderRecord-page'></div>
                            </div>
                        </div>
                        <div className='j_tabContent tab-desc safeguard hide' dangerouslySetInnerHTML={{ __html: globalData.guaranteeText }}>
                        </div>
                        <div className='j_tabContent tab-desc risk-warning hide' dangerouslySetInnerHTML={{ __html: globalData.projectRiskText }}>
                        </div>
                    </div >
                </div >
            </div >
            <Footer PcBuildUrl={PcBuildUrl} globalData={globalData} />
        </div >
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.ConsumptionDetail
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(ConsumptionDetail);