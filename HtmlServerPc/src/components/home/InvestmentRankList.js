import React, { Component } from "react";
import { Common } from "UtilsCommon";

export default class InvestmentRankList extends Component {
    constructor(props) {
        super(props);
    }

    RenderRow(item, index) {
        return (
            <tr key={Common.CreateGuid()}>
                <td className="sort"><span>{index + 1}</span></td>
                <td>{item.nickName}</td>
                <td className="money">{'￥' + Common.ToCurrency(item.investmentAmount) + '元'}</td>
            </tr>
        )
    }

    render() {
        const { InvestmentRank } = this.props

        return (
            <div className="billboard">
                <div className="title"><span>{InvestmentRank.currentMonth}</span>月用户风云榜<b>统计不含散标直投</b>
                </div>
                <table><thead>
                    <tr>
                        <th width="30%">排名</th>
                        <th width="30%">用户名</th>
                        <th width="40%">出借金额</th>
                    </tr></thead>
                    <tbody>
                        {InvestmentRank.items && InvestmentRank.items.map((m, i) => this.RenderRow(m, i))}
                    </tbody>
                </table>
            </div>
        )
    }
}