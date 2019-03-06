import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";

export default class MonthGoldInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = {
            hour1: 0,
            hour2: 0,
            minute1: 0,
            minute2: 0,
            second1: 0,
            second2: 0,
            IsEnd: false
        }
    }

    CountDown(currentTime) {
        this.IntervalId = setInterval(this.GetCountDown.bind(this, currentTime), 1000);
    }

    RenderCountDown() {
        const { openTime, closeTime, status } = this.props.InvestProduct;
        if (!this.props.Now || !(openTime && closeTime)) return null;

        const { hour1, hour2, minute1, minute2, second1, second2, IsEnd } = this.state;

        var currentTime = this.props.Now;
        if (openTime && openTime > currentTime || status === 1) return <div className='waiting'>加入还未开始，请耐心等待~</div>;
        else if (closeTime && closeTime < currentTime || status === 3 || IsEnd) return <div className='waiting'>本场已结束，请等待下一场～</div>;
        else {
            this.CountDown(currentTime);
            return (
                <div className='count'>
                    <p>本次加入距离结束还剩：</p>
                    <div className='count-down'>
                        <span className='hour1'>{hour1}</span>
                        <span className='hour2'>{hour2}</span><i>:</i>
                        <span className='minute1'>{minute1}</span>
                        <span className='minute2'>{minute2}</span><i>:</i>
                        <span className='second1'>{second1}</span>
                        <span className='second2'>{second2}</span>
                        <div className='line'></div>
                    </div>
                    <div className='count-tip'><i>小时</i><i>分钟</i><i>秒</i></div>
                </div>
            )
        }
    }

    GetCountDown(currentTime) {
        currentTime = currentTime + 1000;
        var remainTime = closeTime - currentTime,
            remainSecond = parseInt(remainTime / 1000);

        var hour = Math.floor(remainSecond / 3600),
            hour1 = parseInt(hour / 10),
            hour2 = hour % 10,
            minute = Math.floor((remainSecond - hour * 3600) / 60),
            minute1 = parseInt(minute / 10),
            minute2 = minute % 10,
            second = Math.floor(remainSecond - hour * 3600 - minute * 60),
            second1 = parseInt(second / 10),
            second2 = second % 10;

        if (currentTime >= closeTime) {
            this.setState({ IsEnd: true });
            this.props.Page.SetBuyButton(true);
        }
        else this.setState({ hour1, hour2, minute1, minute2, second1, second2 })
    }

    componentWillUnmount() {
        if (this.IntervalId > 0) clearInterval(this.IntervalId);
    }

    render() {
        const { InvestProduct } = this.props;

        return (
            <div className='main-product'>
                <p className='title'>{InvestProduct.name}<span>-{InvestProduct.releasePeriodCount}期 ( 每天10:00、20:00发售 )</span></p>
                <table>
                    <tbody>
                        <tr>
                            <td className='rate month-color'>{Common.ToFixed(InvestProduct.apr, 1)}%</td>
                            <td>{InvestProduct.period}<span>天</span></td>
                            <td>{InvestProduct.lowestTender}<span>元</span></td>
                            {InvestProduct.status === 3
                                ? <td className='money'>0<span>元</span></td>
                                : <td className='money'>{Common.ToCurrency(InvestProduct.remAccount)}<span>元</span></td>
                            }
                        </tr>
                        <tr>
                            <th align='left'>历史年化收益</th>
                            <th align='left'>后可申请转让</th>
                            <th align='left'>起投金额</th>
                            <th align='left'>剩余额度</th>
                        </tr>
                    </tbody>
                </table>
                <div className='some-tip'>
                    <p>开放总额：<span>{Common.ToCurrency(InvestProduct.account)}</span>元</p>
                    <p>加入上限：<span>{Common.ToCurrency(InvestProduct.mostTender)}</span>元</p>
                    <p>起息时间：募集成功后开始计息</p>
                </div>
                <div className='clearfix'>{this.RenderCountDown()}</div>
            </div>
        )
    }
}