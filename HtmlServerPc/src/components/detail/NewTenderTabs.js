import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";
import ProjectRiskText from "../../configs/ProjectRiskText";
import InvestmentRecordList from "./InvestmentRecordList";
import DebentureMoneyList from "./DebentureMoneyList";

export default class NewTenderTabs extends BaseIndex {
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
                    <li className={this.GetLiClassName(3)}><a onClick={this.SetSelectTabIndex.bind(this, 3)}>风险提示</a></li>
                </ul>
                <div className='content'>
                    <div className={this.GetDivClassName("j_tabContent detail-desc-tender", 0)}>
                        <table>
                            <tbody>
                                <tr>
                                    <th>名称</th>
                                    <td>{InvestProduct.name} - {InvestProduct.releasePeriodCount}期</td>
                                </tr>
                                <tr>
                                    <th className='infor'>服务介绍</th>
                                    <td className='infor-con'>新手标是新元宝计划系列中专门针对新手推出的一种福利计划，未曾在新新贷投标过的用户均有一次机会参与，仅限首次加入。该服务计划在用户认可的标的范围内，对符合要求的标的进行自动投标，服务期结束后，用户可申请债权转让退出，债权转让完成后所获相应本金利息，将返至您新新贷账户的“可用余额”。服务期结束至债权转让成功期间，该服务计划不计息。</td>
                                </tr>
                                <tr>
                                    <th>起息时间</th>
                                    <td>募集成功后次日起息</td>
                                </tr>
                                <tr>
                                    <th>服务期</th>
                                    <td>{InvestProduct.period}个月</td>
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
                                    <td>{InvestProduct.lowestTender}元起投，加入上限{Common.ToCurrency(InvestProduct.mostTender)}元</td>
                                </tr>
                                <tr>
                                    <th>是否使用新手红包</th>
                                    {InvestProduct.useRedenvelope === 'N' && <td>否</td>}
                                    {InvestProduct.useRedenvelope === 'Y' && <td>是</td>}
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
                                    <td><a target='_blank' href={`/xsb/contractForTender/${InvestProduct.id}.html?productSign=XSB`}>《新手标服务协议》</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <InvestmentRecordList Page={this.props.Page} ClassName={this.GetDivClassName("j_tabContent table-content", 1)} Data={InvestmentRecord} InvestProductId={InvestProduct.id} />
                    <DebentureMoneyList Page={this.props.Page} ClassName={this.GetDivClassName("j_tabContent debenture-money", 2)} Data={FinanceBorrowList} ProductName={this.props.ProductName} />
                    <div className={this.GetDivClassName("j_tabContent risk-warning", 3)} dangerouslySetInnerHTML={{ __html: ProjectRiskText }}></div>
                </div>
            </div>
        )
    }
}
