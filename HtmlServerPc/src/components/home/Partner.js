import React, { Component } from "react";
import { Common } from "UtilsCommon";

export default class Partner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            DataList: this.GetDataList(props.DataList),
            MarginLeft: 0
        }
    }

    GetDataList(dataList) {
        return dataList && dataList.length > 0 ? dataList : [];
    }

    SetLeftRight(blLeft) {
        if (this.TimeoutId > 0) return;
        let dataList = this.state.DataList;
        const { DataList } = this.props;
        if (dataList.length === 0 && DataList && DataList.length > 0) dataList = DataList;
        if (dataList.length > 7) {
            let list = [], marginLeft = 0;
            const len = dataList.length;
            if (blLeft) { list = dataList.filter((m, i) => i > 0); list.push(dataList[0]); marginLeft = 0; }
            else { list = [dataList[len - 1]].concat(dataList.filter((m, i) => i < len - 1)); marginLeft = -150; }
            this.setState({ DataList: list, MarginLeft: marginLeft });

            this.SetMarginLeft(blLeft)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.DataList !== nextProps.DataList) {
            this.setState({ DataList: this.GetDataList(nextProps.DataList) });
            return false;
        }
        return true;
    }

    SetMarginLeft(blLeft) {
        let start = blLeft ? 0 : -150;
        const end = blLeft ? -150 : 0;
        const _fn = () => {
            if (start === end) { clearTimeout(this.TimeoutId); this.TimeoutId = 0; return; }

            if (start > end) start -= 25;
            else start += 25;
            this.setState({ MarginLeft: start });

            this.TimeoutId = setTimeout(_fn, 100);
        };

        _fn();
    }

    render() {
        const { MarginLeft, DataList } = this.state;

        return (
            <div className="partner">
                <div className="title">合作伙伴</div>
                <i className="left" onClick={this.SetLeftRight.bind(this, true)}></i>
                <i className="right" onClick={this.SetLeftRight.bind(this, false)}></i>
                <div className="wrap-partner">
                    <ul style={{ marginLeft: MarginLeft + "px" }}>
                        {DataList.map(m => <li key={Common.CreateGuid()}><div><a href={m.textHref} target="_blank"><img src={m.extendUrl} /></a></div><a href={m.textHref}>{m.text}</a></li>)}
                    </ul>
                </div>
            </div>
        )
    }
}