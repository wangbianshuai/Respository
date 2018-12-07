import React, { Component } from "react";
import { Common } from "UtilsCommon";

export default class YYPProduct extends Component {
    constructor(props) {
        super(props);
        this.state = { Display: "none" }
    }

    OnMouseOver() {
        this.SetDisplay("Display", true);
    }

    OnMouseOut() {
        this.SetDisplay("Display", false);
    }

    render() {
        const { PcBuildUrl, YYP } = this.props;
        const { Display } = this.state;

        return (
            <div className="dimension-block overauto">
                <div className="dimension-info clearfix">
                    <h2>月月派<i className="logo"></i>
                    </h2>
                    {!Common.IsNullOrEmpty(YYP.remark) && <div className="tag-hot">
                        <p><span>{YYP.remark}</span></p>
                    </div>}
                    <ul>
                        <li>每月派息</li>
                        <li>募集成功后次日起息，持有30天后可转让</li>
                    </ul>
                </div>
                <div className="dimension-q clearfix">
                    <div className="rate">历史年化收益：
                                        <i><span>{YYP.plannedAnnualRateTo}%</span></i>
                        {!Common.IsNullOrEmpty(YYP.floatingRate) && <div className="plus">+{YYP.floatingRate}%</div>}
                    </div>
                    <div className="limit"><span></span><span>{YYP.frozenPeriod}<br />后可免费申请转让</span></div>
                    <div className="money">起投金额：{YYP.leastTenderAmountLabel}</div>
                    <a target="_blank" className="dimension-mobile-btn" onMouseOver={this.OnMouseOver.bind(this)} onMouseOut={this.OnMouseOut.bind(this)}>
                        <span>APP专享</span><br />
                        累计加入:<i>{YYP.accumulatedInvestors}</i>
                    </a>
                </div>
                <div className="download-QRcode" id="download-qr-code" onMouseOver={this.OnMouseOver.bind(this)} onMouseOut={this.OnMouseOut.bind(this)} style={{ display: Display }}>
                    <img width="128" alt="新新贷app下载二维码" src={PcBuildUrl + "img/qr-code-phone@2x.png"} /><p>手机APP下载</p>
                </div>
            </div>
        )
    }
}