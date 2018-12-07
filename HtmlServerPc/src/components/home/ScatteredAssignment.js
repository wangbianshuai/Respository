import React, { Component } from "react";
import { Common } from "UtilsCommon";

export default class NewsMedia extends Component {
    constructor(props) {
        super(props);

        this.state = { SelectTabIndex: 0 }
    }

    SetSelectTabIndex(index) {
        if (index != this.state.SelectTabIndex) this.setState({ SelectTabIndex: index });
    }

    RenderSBZTProductItems(item) {
        return (
            <ul className="clearfix" key={Common.CreateGuid()}>
                <li className='grade'>
                    <i className={"grade" + item.riskGrade}></i>
                </li>
                <li>
                    {item.label === "ic-xfd" && <i className="icon house-icon"></i>}
                    {item.label === "ic-xcd" && <i className="icon car-icon"></i>}
                    {item.label === "ic-xsd" && <i className="icon business-icon"></i>}
                    {item.label === "ic-xstd" && <i className="icon new-icon"></i>}
                    {item.label === "ic-pxb" && <i className="icon"></i>}
                </li>
                <li className="name"><a href={'borrow/detail/' + item.id + '.html'} target="_blank"
                    title={item.name}>{item.name}</a></li>
                <li className="rate"><span>{item.plannedAnnualRate}</span>%</li>
                <li className="time"><span>{item.leastPeriod + item.leastPeriodUnit}</span></li>
                <li className="money">{'剩余：' + Common.ToCurrency(item.leftAmount) + '元'}
                    <div className="j-process" position="bottom" tipcontent={Common.GetIntValue(((item.bidAmount - item.leftAmount) * 1.00 / item.bidAmount * 100))}>
                        <span></span></div>
                </li>
                <li className="buy">
                    {item.status.code === "SBZT_WAIT_TO_SELL" && <a href={'borrow/detail/' + item.id + '.html'} target="_blank"
                        className="snapped disable">{item.status.message}</a>}

                    {item.status.code === "SBZT_SELLING" && <a href={'borrow/detail/' + item.id + '.html'} target="_blank"
                        className="snapped ga-click xa-click">立即加入</a>}

                    {item.status.code === "SBZT_SOLD_OUT" && <a href={'borrow/detail/' + item.id + '.html'} target="_blank"
                        className="snapped disable">{item.status.message}</a>}
                </li>
            </ul>
        )
    }

    RenderZQZRProductItems(item) {
        return (
            <ul key={Common.CreateGuid()}>
                <li className='grade'>  <i className={"grade" + item.riskGrade}></i></li>
                <li>
                    {item.label === "ic-xfd" && <i className="icon house-icon"></i>}
                    {item.label === "ic-xcd" && <i className="icon car-icon"></i>}
                    {item.label === "ic-xsd" && <i className="icon business-icon"></i>}
                    {item.label === "ic-xstd" && <i className="icon new-icon"></i>}
                    {item.label === "ic-pxb" && <i className="icon"></i>}
                </li>
                <li className="name"><a href={'/traderequest/requestDetail/' + item.id + '.html'} target="_blank" title={item.name}>{item.name}</a></li>
                <li className="rate"><span>{item.plannedAnnualRate}</span>%</li>
                <li className="time">剩余：<span>{item.leastPeriod + item.leastPeriodUnit}</span></li>
                <li className="money">{'转让价：' + Common.ToCurrency(item.transferPrice) + '元'}
                </li>
                <li className="buy">

                    {item.status.code === "ZQZR_WAIT_TO_SELL" && <a href={'/traderequest/requestDetail/' + item.id + '.html'} target="_blank"
                        className="snapped disable">{item.status.message}</a>}

                    {item.status.code === "ZQZR_SELLING" && <a href={'/traderequest/requestDetail/' + item.id + '.html'} target="_blank"
                        className="snapped ga-click xa-click" > 立即加入</a>}

                    {item.status.code === "ZQZR_SOLD_OUT" && <a href={'/traderequest/requestDetail/' + item.id + '.html'} target="_blank"
                        className="snapped disable">{item.status.message}</a>}
                </li>
            </ul>
        )
    }

    render() {
        const { SelectTabIndex } = this.state;
        const { ZQZR, SBZT } = this.props;

        return (
            <div className="scattered-and-assignment">
                <div className="tab">
                    <ul id="J_scatteredAndAssignment">
                        <li className={SelectTabIndex === 0 ? "active" : ""} onClick={this.SetSelectTabIndex.bind(this, 0)}>散标直投</li>
                        <li className={SelectTabIndex === 1 ? "active" : ""} onClick={this.SetSelectTabIndex.bind(this, 1)}>债权转让<i></i></li>
                    </ul>
                    <a className="more" href="/borrow/search/list.html" target="_blank">查看更多</a>
                </div>
                <div className={"scattered" + (SelectTabIndex === 0 ? "" : " hide")}>
                    {SBZT && SBZT.map && SBZT.map(m => this.RenderSBZTProductItems(m))}
                </div>
                <div className={"assignment" + (SelectTabIndex === 1 ? "" : " hide")}>
                    {ZQZR && ZQZR.map && ZQZR.map(m => this.RenderZQZRProductItems(m))}
                </div>
            </div>
        )
    }
}