import React from "react";
import { BaseIndex } from "ReactCommon";
import ProjectRiskText from "../../configs/ProjectRiskText";
import InvestmentRecordList from "./InvestmentRecordList";
import DebentureMoneyList from "./DebentureMoneyList";

export default class ThirtyTenderTabs extends BaseIndex {
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
                                    <td>{InvestProduct.period}个月</td>
                                </tr>
                                <tr>
                                    <th className='h90'>历史年化收益率</th>
                                    <td className='h90'>
                                        {InvestProduct.floatApr > 0 ? <div>{InvestProduct.apr}%
                                            <div className="plus">+{InvestProduct.floatApr}%<p className='new-hot xszx-tip'>新手专享加息<i></i></p></div>
                                        </div>
                                            : <div>{InvestProduct.apr}%</div>}
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
                                        {InvestProduct.floatApr > 0 ? <b> 历史收益=加入金额*{InvestProduct.apr}%/12 +加入金额*{InvestProduct.floatApr}%/12</b>
                                            : <b> 历史收益=加入金额*{InvestProduct.apr}%/12</b>}
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
                                    <td><a target="_blank" href={'/commpd/agree/XSCP30T_agree_' + InvestProduct.id + '.html?productSign=XSCP30T'}>《新元宝（新手专享）服务协议》</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <InvestmentRecordList Page={this.props.Page} ClassName={this.GetDivClassName("j_tabContent table-content", 1)} Data={InvestmentRecord} InvestProductId={InvestProduct.id} />
                    <DebentureMoneyList Page={this.props.Page} ClassName={this.GetDivClassName("j_tabContent debenture-money", 2)} Data={FinanceBorrowList} ProductName={this.props.ProductName} />
                    <div className={this.GetDivClassName("j_tabContent ask-answer", 3)}>
                        <h6>1.我为什么无法出借新元宝（新手专享）？</h6>
                        <p>新元宝（新手专享）仅针对未在新新贷平台出借过的新用户，且每位用户只能参与一次。</p>
                        <h6>2.新元宝（新手专享）产品可以使用红包吗？</h6>
                        <p>不可以。红包仅限用于新元宝等普通产品，请详见红包使用说明。</p>
                        <h6>3.新元宝（新手专享）如何退出？</h6>
                        <p>服务期内不支持提前退出。服务期结束后由出借人手动申请退出进行债权转让，具体时长视债权转让交易情况而定。债权成功转让后资金返至出借人的新新贷账户中，并可在账户的“可用余额”查询。</p>
                    </div>
                    <div className={this.GetDivClassName("j_tabContent risk-warning", 4)} dangerouslySetInnerHTML={{ __html: ProjectRiskText }}>
                    </div>
                </div>
            </div>
        )
    }
}