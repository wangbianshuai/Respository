import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex, Paging } from "ReactCommon";

export default class DebentureMoneyList extends BaseIndex {
    constructor(props) {
        super(props);
    }

    PagingChange(pageInfo) {
        const { Page } = this.props;
        const { PageIndex, PageSize } = pageInfo;
        Page.Dispatch("TradeCenterService", "QueryFinanceBorrowList", { Url: `investBiz/queryFinanceBorrowList?currentPage=${PageIndex}&pageSize=${PageSize}` })
    }

    RenderItem(item, index, count) {
        const { ProductName } = this.props;
        const url = encodeURI(encodeURI(`/borrow/detail/${item.borrowId}.html?proname=${ProductName}`));
        return (
            <tr key={Common.CreateGuid()} className={index === count - 1 ? "last" : ""}>
                <td><a target="_blank" href={url}> {item.name} </a></td>
                <td>{item.account}</td>
                <td>{item.apr}</td>
                <td>{item.period + item.periodUnit}</td>
            </tr>
        );
    }

    render() {
        const { Data, ClassName } = this.props;
        return (
            <div className={ClassName}>
                <p>近期借款项目（您的资金将可能出借到以下任意一个或多个项目中，您可在出借后前往我的新新贷-出借管理查询详细的匹配记录。）</p>
                <table id="J_debenture">
                    <thead>
                        <tr>
                            <th>项目名称</th>
                            <th>借款金额</th>
                            <th>借款利率</th>
                            <th>借款期限</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data && Data.items.length > 0
                            ? Data.items.map((m, i) => this.RenderItem(m, i, Data.items.length))
                            : <tr className='no-record'><td colSpan='4'>没有债权记录</td></tr>}
                    </tbody>
                </table>
                <div className='pagination debenture-page'>
                    <Paging PageRecord={Data.totalCount} PageIndex={Data.currentPage} PageSize={Data.pageSize} Change={this.PagingChange.bind(this)} />
                </div>
            </div>
        )
    }
}