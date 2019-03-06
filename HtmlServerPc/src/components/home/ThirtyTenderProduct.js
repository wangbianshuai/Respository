import React, { Component } from "react";

export default class ThirtyTenderProduct extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { ThirtyTender } = this.props;

        return (
            <div className="dimension clearfix dimension-thirtytender" id="J_qtds">
                <div className="dimension-title dimension-title-thirty">
                    <h6>新手专区</h6>
                    <p>新手用户&nbsp;专享福利</p>
                    <a href="/detail/thirtytender.html">查看详情</a>
                </div>
                <div className='dimension-con'>
                    <dl className="dimension-name clearfix">
                        <dt>新元宝（新手专享）</dt>
                        <dd>限参与一次</dd>
                        <span>已累计加入：{ThirtyTender.accumulatedInvestors}</span>
                    </dl>
                    <ul className="dimension-buy clearfix">
                        <li className="rate">
                            <div className="wrap">
                                <i>{ThirtyTender.plannedAnnualRate}</i>%
                      {ThirtyTender.floatingRate > 0 && <div className="plus">+{ThirtyTender.floatingRate}%
                            <p className='xszx-tip'>
                                        新手专享加息
                                <i></i>
                                    </p>
                                </div>}
                            </div>
                            <br />历史年化收益
                    </li>
                        <li>
                            <span>{ThirtyTender.leastPeriod}{ThirtyTender.leastPeriodUnit}</span><br />
                            后可申请转让
                    </li>
                        <li><span>{ThirtyTender.leastTenderAmountLabel}</span><br />起投金额</li>
                        <li className="dimension-btn">
                            {ThirtyTender.status.code === "WAIT_TO_SELL" && <a target="_blank" className="btn-active ga-click xa-click disable" >{ThirtyTender.status.message}</a>}

                            {ThirtyTender.status.code === "SELLING" && <a href="/detail/thirtytender.html" target="_blank" className="btn-active ga-click xa-click">立即加入</a>}

                            {ThirtyTender.status.code === "SOLD_OUT" && <a target="_blank" className="btn-active ga-click xa-click disable">{ThirtyTender.status.message}</a>}
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}