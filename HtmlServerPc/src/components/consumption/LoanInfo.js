import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";

export default class LoanInfo extends BaseIndex {
    constructor(props) {
        super(props);
    }

    render() {
        const { BidsDetail } = this.props;

        return (
            <div className='loan-focus'>
                <table>
                    <thead>
                        <tr>
                            <th>借款金额</th>
                            <th>历史年化收益<p className='yearReturns-tip'>?<span>历史年化收益率是指参考同类型项目的历史数据得出的收益率<i></i></span></p></th>
                            <th>借款期限</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span><i id='borrowMoney'>{Common.ToCurrency(BidsDetail.bidAmount)}</i>元</span>
                            </td>
                            <td><span id='tableEarnings'>{Common.ToCurrency(BidsDetail.plannedAnnualRate)}</span>%</td>
                            <td><span id='leastPeriod'>{BidsDetail.leastPeriodValue}</span>个月</td>
                        </tr>
                    </tbody>
                </table>
                <div className='consumption-icon'><i><b></b></i>新宜贷</div>
                <p>
                    <em>借款用途：{BidsDetail.loanPurpose.message}</em>
                    <span>还款方式：<i id='modeRepay'>{BidsDetail.repaymentType.message}</i></span>
                    {BidsDetail.repaymentType.code === "001" && <em className='modeRepay-tip'>?
                     <span>每月应还本息=[借款金额×历史年化收益÷12×（1+历史年化收益÷12）^借款期限]÷[（1+历史年化收益÷12）^借款期限－1] 。应还总利息为每月应还利息总合。应还本金为借款金额。<i></i></span>
                    </em>}
                </p>
                <p>
                    <em>最低投标：{Common.ToCurrency(BidsDetail.tenderAmountDown)}元</em><span>债权转让：{BidsDetail.isSupportCreditAssignment.message}</span>
                </p>
                <p><em>投标奖励：无</em><span>投标且复审成功后可获得奖励</span></p>
                <p><em>标的状态：{BidsDetail.status.message}</em><span>预计起息时间：{BidsDetail.plannedValueDate}</span></p>
                <p><em>风险等级：{BidsDetail.riskGrade}</em><span>募集截止日期：{BidsDetail.endTime}</span></p>
            </div>
        )
    }
}