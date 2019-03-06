import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";

export default class PbocInfoList extends BaseIndex {
    constructor(props) {
        super(props);

    }

    RenderRow(item) {
        return (
            <tr key={Common.CreateGuid()}>
                <td>{item.creditType === "1" ? "信用卡" : item.creditType === "2" ? "购房贷款" : "其他贷款"}</td>
                <td>{item.accountNum}</td>
                <td>{item.osAccountNum}</td>
                <td>{item.overdueAccountNum}</td>
                <td>{item.overdue90AccountNum}</td>
                <td>{item.guaranteeNum}</td>
            </tr>
        );
    }

    render() {
        const { DataList } = this.props;
        if (DataList && DataList.length > 0)
            return (
                <div className='credit'>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>账户数</th>
                                <th>未清算/未销户账户数</th>
                                <th>发生逾期的账户数</th>
                                <th>发生过90天以上逾期的账户数</th>
                                <th>为他人担保笔数</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DataList.map(m => this.RenderRow(m))}
                        </tbody>
                    </table>
                </div>
            )
        else return <div><p><span>借款人未提供</span></p></div>
    }
}