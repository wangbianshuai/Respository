import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";

export default class Repayments extends BaseIndex {
    constructor(props) {
        super(props);

    }

    RenderItem(item, index, count) {
        return (
            <tr key={Common.CreateGuid()} className={index === count - 1 ? "last" : ""}>
                <td>{item.porder}</td>
                <td>{Common.DateFormat(item.dueRepaymentDate, 'yyyy-MM-dd')}</td>
                <td>{Common.DateFormat(item.actualRepaymentPayedDate, 'yyyy-MM-dd')}</td>
                <td>{Common.ToCurrency(item.actualRepaymentPayedAmount)}</td>
                <td>{item.dueRepaymentAmount}</td>
                <td>{item.status.message}</td>
            </tr>
        );
    }

    render() {
        const { DataList } = this.props;
        return (
            <div className='table-content'>
                <table>
                    <thead>
                        <tr>
                            <th>期数</th>
                            <th>待还日期</th>
                            <th>实还日期</th>
                            <th>已还金额</th>
                            <th>待还金额</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataList && DataList.length > 0
                            ? DataList.map((m, i) => this.RenderItem(m, i, DataList.length))
                            : <tr className='no-record'><td colSpan='6'>没有还款记录</td></tr>}
                    </tbody>
                </table>
                <div className='pagination repayment-page'></div>
            </div>
        )
    }
}