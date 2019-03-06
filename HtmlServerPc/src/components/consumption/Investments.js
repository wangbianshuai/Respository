import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex, Paging } from "ReactCommon";

export default class Investments extends BaseIndex {
    constructor(props) {
        super(props);
    }

    TenderRecordChange(pageInfo) {
        const { Page } = this.props;
        const { PageIndex, PageSize } = pageInfo;
        const bidCode = Page.BidCode;
        const payload = { Url: `bids/${bidCode}/investments?currentPage=${PageIndex}&pageSize=${PageSize}` }
        Page.Dispatch("IntegrationService", "GetBidsInvestments", payload);
    }

    RenderItem(item, index, count) {
        return (
            <tr key={Common.CreateGuid()} className={index === count - 1 ? "last" : ""}>
                <td>{item.borrower}</td>
                <td>{Common.ToCurrency(item.tenderAmount)}</td>
                <td>{Common.GetDateString(item.tenderDate)}</td>
                <td>{item.status.message}</td>
            </tr>
        );
    }

    render() {
        const { Data } = this.props;
        return (
            <div className='table-content '>
                <table id="J_tenderRecord">
                    <thead>
                        <tr>
                            <th>投标人</th>
                            <th>投标金额</th>
                            <th>投标时间</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data.items.length > 0
                            ? Data.items.map((m, i) => this.RenderItem(m, i, Data.items.length))
                            : <tr className='no-record'><td colSpan='4'>没有投标记录</td></tr>}
                    </tbody>
                </table>
                <div className='pagination tenderRecord-page'>
                    <Paging PageRecord={Data.totalCount} PageIndex={Data.currentPage} PageSize={Data.pageSize} Change={this.TenderRecordChange.bind(this)} />
                </div>
            </div>
        )
    }
}