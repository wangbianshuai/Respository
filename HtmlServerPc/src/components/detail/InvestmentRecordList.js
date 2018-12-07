import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex, Paging } from "ReactCommon";

export default class InvestmentRecordList extends BaseIndex {
    constructor(props) {
        super(props);
    }

    PagingChange(pageInfo) {
        const { Page, InvestProductId } = this.props;
        const { PageIndex, PageSize } = pageInfo;
        const { Sign } = Page
        Page.Dispatch("TradeCenterService", "GetInvestmentRecord", { Url: `investProduct/${Sign}/investmentRecord?reglintstId=${InvestProductId}&currentPage=${PageIndex}&pageSize=${PageSize}` })
    }

    RenderItem(item, index, count) {
        return (
            <tr key={Common.CreateGuid()} className={index === count - 1 ? "last" : ""}>
                <td>{(index + 1)}</td>
                <td>{item.userName}</td>
                <td>{item.account}</td>
                <td><span>{Common.GetDateString(item.addTime)}</span></td>
            </tr>
        );
    }

    render() {
        const { Data, ClassName } = this.props;
        return (
            <div className={ClassName}>
                <table id="J_tableRecord">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>出借人</th>
                            <th>加入金额</th>
                            <th>加入时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data && Data.items.length > 0
                            ? Data.items.map((m, i) => this.RenderItem(m, i, Data.items.length))
                            : <tr className='no-record'><td colSpan='4'>没有加入记录</td></tr>}
                    </tbody>
                </table>
                <div className='pagination table-page'>
                    <Paging PageRecord={Data.totalCount} PageIndex={Data.currentPage} PageSize={Data.pageSize} Change={this.PagingChange.bind(this)} />
                </div>
            </div>
        )
    }
}