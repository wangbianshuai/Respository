import React, { Component } from "react";
import { Common } from "UtilsCommon";

export default class YJDJProduct extends Component {
    constructor(props) {
        super(props);

        this.state = { LeftTime: this.GetYJDJLeftTime(props.YJDJ) }
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.props.YJDJ !== nextProps.YJDJ && this.ReceiveYJDJ(nextProps.YJDJ);
        return true;
    }

    componentDidMount() {
        this.ReceiveYJDJ(this.props.YJDJ)
    }

    ReceiveYJDJ(yjdj) {
        if (yjdj && yjdj.leftTime) {
            var leftTime = Common.GetIntValue(yjdj.leftTime, 0);

            const _countdown = (surplus) => {
                if (surplus > 0) {
                    surplus -= 1000;
                    this.setState({ LefTime: surplus });
                    setTimeout(() => _countdown(surplus), 1000);
                }
            }
            _countdown(leftTime);
        }
        else this.setState({ LefTime: null });
    }

    GetYJDJLeftTime(yjdj) {
        if (yjdj && yjdj.leftTime) return yjdj.leftTime;
    }

    render() {
        const { LeftTime } = this.state;
        const { YJDJ } = this.props;

        return (
            <div className="dimension dimension-gold clearfix">
                <div className="dimension-title dimension-title-gold">
                    <h6>人气专区</h6>
                    <div className="time">每天10:00、20:00发售</div>
                    <a href="/detail/monthgold.html">查看详情</a>

                </div>
                <div className='dimension-con'>
                    <dl className="dimension-name dimension-name-gold clearfix">
                        <dt>月进斗金</dt>
                        <dd>每日限量|先到先得</dd>
                        {LeftTime && <div className="tip tip-gold j_countdown">
                            <p>距离结束还剩：</p>
                            <span>{Common.NumberToTime(LeftTime)}</span>
                        </div>}
                    </dl>
                    <ul className="dimension-buy clearfix">
                        <li className="rate"><span><i>{Common.GetIntValue(YJDJ.plannedAnnualRate)}</i>%</span><br />历史年化收益</li>
                        <li>
                            <span>{YJDJ.leastPeriod}{YJDJ.leastPeriodUnit}</span><br />
                            后可申请转让
                    </li>
                        <li>
                            <span>{Common.ToCurrency(Common.GetIntValue(YJDJ.plannedAmount), false)}元</span><br />计划金额
                    </li>
                        <li className="dimension-btn">

                            {YJDJ.status.code === "WAIT_TO_SELL" && <a target="_blank" className="btn-active disable">{YJDJ.status.message}</a>}

                            {YJDJ.status.code === "SELLING" && <a href="/detail/monthgold.html" target="_blank" className="btn-active ga-click xa-click">立即加入</a>}

                            {YJDJ.status.code === "SOLD_OUT" && <a target="_blank" className="btn-active disable">本场已结束</a>}

                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}