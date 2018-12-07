import React, { Component } from "react";
import { Common } from "UtilsCommon";

export default class XYBProduct extends Component {
    constructor(props) {
        super(props);
    }

    RenderItem(item) {
        return (
            <div className="dimension-q clearfix" key={Common.CreateGuid()}>
                <div className="rate">历史年化收益：
                <span className='w85'>{item.plannedAnnualRateTo + '%'}</span>
                    {!Common.IsNullOrEmpty(item.remark) && <div className="tag-hot"><p><span>{item.remark}</span></p></div>}
                    {item.floatingRate > 0 && <span className="plus"> + {item.floatingRate}%</span>}
                </div>
                <div className="limit"><i></i><i><span>{item.frozenPeriod}</span>个月<br />后可免费申请转让</i></div>
                <div className="money">起投金额：<span>{item.leastTenderAmountLabel}</span></div>
                <div>
                    {item.status.code === "WAIT_TO_SELL" && <a href={'/xplan/detail/' + item.id + '.html'} target="_blank"
                        className="btn-active disable">{item.status.message}</a>}

                    {item.status.code === "SELLING" && <a href={'/xplan/detail/' + item.id + '.html'} target="_blank"
                        className="btn-active ga-click xa-click">立即加入</a>}

                    {item.status.code === "SOLD_OUT" && <a href={'/xplan/detail/' + item.id + '.html'} target="_blank"
                        className="btn-active disable">{item.status.message}</a>}

                    {item.status.code === "EARNING" && <a href={'/xplan/detail/' + item.id + '.html'} target="_blank"
                        className="btn-active disable">{item.status.message}</a>}
                </div>
            </div>
        )
    }

    render() {
        const { XYB } = this.props;
        return (
            <div className="dimension-block">
                <div className="dimension-info clearfix">
                    <h2>新元宝</h2>
                    <ul>
                        <li>募集成功后次日起息</li>
                    </ul>
                    <div className="count">累计加入：{XYB.accumulatedInvestors}</div>
                </div>
                {XYB.items.map(m => this.RenderItem(m))}
            </div>
        )
    }
}