import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";

export default class MonthGoldInfo extends BaseIndex {
    constructor(props) {
        super(props);
    }

    render() {
        const { InvestProduct } = this.props;

        return (
            <div className='main-product'>
                <p className='title'>{InvestProduct.name}<span>{InvestProduct.releasePeriodCount}期</span></p>
                <table>
                    <tbody>
                        <tr>
                            <td><span>{Common.ToCurrency(InvestProduct.account)}</span>元</td>
                            <td className='rate'>{InvestProduct.apr}%</td>
                            <td className='last'>{InvestProduct.period}个月</td>
                        </tr>
                        <tr>
                            <th>计划金额</th>
                            <th>历史年化收益率</th>
                            <th className='last'>后可申请转让</th>
                        </tr>
                    </tbody>
                </table>
                <p>起息时间：募集成功后次日开始计息<span className='buyTip'>加入规则：{InvestProduct.lowestTender}元起投，加入上限{Common.ToCurrency(InvestProduct.mostTender)}元</span></p>
                <p>退出方式：{InvestProduct.period}个月后用户可申请债权转让退出</p>
                <p className='new-tip'>*仅限未曾在新新贷投标过的用户加入，每位用户限参与1次</p>
            </div>
        )
    }
}