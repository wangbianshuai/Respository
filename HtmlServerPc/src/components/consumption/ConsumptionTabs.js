import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";
import GuaranteeText from "../../configs/GuaranteeText";
import ManagementText from "../../configs/ManagementText";
import ProjectRiskText from "../../configs/ProjectRiskText";
import Investments from "./Investments";
import Repayments from "./Repayments";
import PbocInfoList from "./PbocInfoList";

export default class ConsumptionTabs extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = { SelectTabIndex: 0 }
    }

    SetSelectTabIndex(index) {
        if (index != this.state.SelectTabIndex) this.setState({ SelectTabIndex: index });
    }

    GetLiClassName(index) {
        const { SelectTabIndex } = this.state;
        return SelectTabIndex === index ? "active" : "";
    }

    GetDivClassName(name, index) {
        const { SelectTabIndex } = this.state;
        return name + (SelectTabIndex === index ? "" : " hide");
    }

    render() {
        const { IsLogin, BidsRepayments, BidsDetail } = this.props;

        const BidsBorrower = this.GetPropsValue("BidsBorrower", {});
        const BidsInfoDisclosures = this.GetPropsValue("BidsInfoDisclosures", {});
        const show = this.IsSuccessProps("BidsInfoDisclosures");
        const BidsInvestments = this.GetPropsValue("BidsInvestments", { totalCount: 0, items: [], currentPage: 1, pageSize: 10 });

        return (
            <div className='consumption-tabs'>
                <ul className='clearfix nav' id='consumptionNav'>
                    <li className={this.GetLiClassName(0)}><a onClick={this.SetSelectTabIndex.bind(this, 0)}>借款详情</a></li>
                    <li className={this.GetLiClassName(1)}><a onClick={this.SetSelectTabIndex.bind(this, 1)}>还款记录</a></li>
                    <li className={this.GetLiClassName(2)}><a onClick={this.SetSelectTabIndex.bind(this, 2)}>投标记录</a></li>
                    <li className={this.GetLiClassName(3)}><a onClick={this.SetSelectTabIndex.bind(this, 3)}>安全保障</a></li>
                    <li className={this.GetLiClassName(4)}><a onClick={this.SetSelectTabIndex.bind(this, 4)}>项目风险提示</a></li>
                </ul>
                <div className='tab-content' id='tab-content'>
                    <div className={this.GetDivClassName("j_tabContent tab-desc loan-details", 0)}>
                        {!IsLogin && <p className='login-tip '>只有 <a href="/user/iregister.html">注册</a>
                            用户才可以查看借款人详细信息！现在 <a href="/user/ilogin.html">登录</a></p>}
                        {IsLogin && <div className='borrower-details'>
                            <h6>借款人详情</h6>
                            <div>
                                <p><span>借款人姓名：{BidsBorrower.realname}</span><span>身份证号码：{BidsBorrower.idCardNo}</span>
                                </p>
                                <p><span>借款人主体: 自然人</span><span>年龄：{BidsBorrower.age} 岁</span>
                                </p>
                                <p><span>性别：{BidsBorrower.gender}</span><span>所在地：{BidsBorrower.location} </span>
                                </p>
                                <p><span>所属行业：{BidsInfoDisclosures.industry}</span><span>工作性质：{BidsInfoDisclosures.workType}</span>
                                </p>
                                <p><span>收入情况：{BidsInfoDisclosures.incomeStr}</span><span>负债情况：{Common.IsNullOrEmpty(BidsInfoDisclosures.liabilityStr) ? '无重大负债' : BidsInfoDisclosures.liabilityStr}</span>
                                </p>
                            </div>
                            <h6>借款相关</h6>
                            <div>
                                <p><span>逾期次数：{BidsBorrower.overdueCount}</span><span>逾期金额：{BidsBorrower.overdueSumAmount}</span>
                                    <span>成功借款次数：{BidsBorrower.successLoanNum}</span>
                                </p>
                            </div>
                            <h6>征信报告</h6>
                            <PbocInfoList DataList={BidsInfoDisclosures.pbocInfoList} />
                            <h6>借款描述</h6>
                            <p>{BidsBorrower.bidInfo}</p>
                            {BidsDetail.bidAmount <= 200000 && <div>
                                <h6>在其他网络借贷平台借款情况</h6>
                                <div dangerouslySetInnerHTML={{ __html: ManagementText }}></div>
                            </div>}
                            {show && BidsDetail.status.code === 'REPAYING' && BidsInfoDisclosures.updateDate && <h6>其他相关信息（更新时间：{Common.DateFormat(BidsInfoDisclosures.updateDate, 'yyyy/MM/dd')}</h6>}
                            {show && BidsDetail.status.code === 'REPAYING' && BidsInfoDisclosures.updateDate && <div className='others'>
                                <p>资金运用情况：{BidsInfoDisclosures.fundsUse}</p>
                                <p>借款人还款能力变化：{BidsInfoDisclosures.repaymentAbilityChange}</p>
                                <p>借款人涉诉及受行政处罚情况：{BidsInfoDisclosures.complaintsAdmPenalties}</p>
                            </div>}
                        </div>}
                    </div>
                    <div className={this.GetDivClassName("j_tabContent tab-desc repayment-record", 1)}>
                        <Repayments DataList={BidsRepayments} />
                    </div>
                    <div className={this.GetDivClassName("j_tabContent tab-desc tender-record", 2)}>
                        <Investments Data={BidsInvestments} Page={this.props.Page} />
                    </div>
                    <div className={this.GetDivClassName("j_tabContent tab-desc safeguard", 3)} dangerouslySetInnerHTML={{ __html: GuaranteeText }}>
                    </div>
                    <div className={this.GetDivClassName("j_tabContent tab-desc risk-warning", 4)} dangerouslySetInnerHTML={{ __html: ProjectRiskText }}>
                    </div>
                </div>
            </div>
        )
    }
}