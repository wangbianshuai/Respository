import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";
import ProjectRiskText from "../../configs/ProjectRiskText";
import InvestmentRecordList from "./InvestmentRecordList";
import DebentureMoneyList from "./DebentureMoneyList";

export default class MonthGoldTabs extends BaseIndex {
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
        const InvestProduct = this.GetPropsValue("InvestProduct", {});
        const InvestmentRecord = this.GetPropsValue("InvestmentRecord", { totalCount: 0, items: [], currentPage: 1, pageSize: 10 });
        const FinanceBorrowList = this.GetPropsValue("FinanceBorrowList", { totalCount: 0, items: [], currentPage: 1, pageSize: 10 });

        return (
            <div className='product-tabs'>
                <ul className='nav' id="J_tabs">
                    <li className={this.GetLiClassName(0)}><a onClick={this.SetSelectTabIndex.bind(this, 0)}>服务介绍</a></li>
                    <li className={this.GetLiClassName(1)}><a onClick={this.SetSelectTabIndex.bind(this, 1)}>加入记录<span>（{InvestmentRecord.totalCount}）</span></a></li>
                    <li className={this.GetLiClassName(2)}><a onClick={this.SetSelectTabIndex.bind(this, 2)}>债权列表</a></li>
                    <li className={this.GetLiClassName(3)}><a onClick={this.SetSelectTabIndex.bind(this, 3)}>常见问题</a></li>
                    <li className={this.GetLiClassName(4)}><a onClick={this.SetSelectTabIndex.bind(this, 4)}>风险提示</a></li>
                </ul>
                <div className='content'>
                    <div className={this.GetDivClassName("j_tabContent detail-desc", 0)}>
                        <table>
                            <tbody>
                                <tr>
                                    <th className='title'>名称</th>
                                    <td className='title'>{InvestProduct.name}<span>-{InvestProduct.releasePeriodCount}期</span></td>
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
                                    <td>{InvestProduct.period}天</td>
                                </tr>
                                <tr>
                                    <th>历史年化收益率</th>
                                    <td>{InvestProduct.apr}%</td>
                                </tr>
                                <tr>
                                    <th>收益计算</th>
                                    <td>
                                        <b>
                                            历史收益=加入金额*{InvestProduct.apr}%/360*31
                                        </b>
                                    </td>
                                </tr>
                                <tr>
                                    <th>加入条件</th>
                                    <td>加入金额{InvestProduct.lowestTender}元起，并以{InvestProduct.lowestTender}元的整数倍递增</td>
                                </tr>
                                <tr>
                                    <th>单账户加入额度</th>
                                    <td className="infor-con">{Common.ToCurrency(InvestProduct.mostTender)}元，不限制加入次数。如果加入金额达到上限，可等待服务期结束申请退出后，资金回到新新贷账户中，个人可加入额度释放，继续加入</td>
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
                                    <td><a target="_blank" href={`/commpd/agree/monthgold_agree_${InvestProduct.id}.html?productSign=YJDJ`}>《月进斗金服务协议》</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <InvestmentRecordList Page={this.props.Page} ClassName={this.GetDivClassName("j_tabContent table-content", 1)} Data={InvestmentRecord} InvestProductId={InvestProduct.id} />
                    <DebentureMoneyList Page={this.props.Page} ClassName={this.GetDivClassName("j_tabContent debenture-money", 2)} Data={FinanceBorrowList} ProductName={this.props.ProductName} />
                    <div className={this.GetDivClassName("j_tabContent ask-answer", 3)}>
                        <h6>1.月进斗金如何退出？</h6>
                        <p>月进斗金服务期内不支持提前退出。您在服务期结束后由出借人手动申请退出进行债权转让，具体时长视债权转让交易情况而定。债权成功转让后资金返至出借人的新新贷账户中，并可在账户的“可用余额”查询。</p>
                        <h6>2.我已经加入了月进斗金1000元，还能继续加入吗？</h6>
                        <p>可以，月进斗金单账户加入上限为3000元，可以加入多次。如果加入金额达到上限，可等待服务期结束申请退出后，资金回到新新贷账户中，个人可加入额度释放，继续加入。</p>
                    </div>
                    <div className={this.GetDivClassName("j_tabContent risk-warning", 4)} dangerouslySetInnerHTML={{ __html: ProjectRiskText }}>
                    </div>
                </div>
            </div>
        )
    }
}