import React, { Component } from "react"
import { Row, Col, Divider } from "antd"
import * as Common from "../utils/Common"
import PropertyItem from "../components/PropertyItem"
import AButton from "../controls/AButton"
import Popconfirm2 from "../controls/Popconfirm2"
import SpanText from "../controls/SpanText"

export default class Index extends Component {
    constructor(props) {
        super(props)
    }

    RenderActions(actionList, record) {
        const list = []

        for (let i = 0; i < actionList.length; i++) {
            if (i > 0) list.push(<Divider type="vertical" key={i} />)
            if (actionList[i].IsConfrim) list.push(<Popconfirm2 Property={actionList[i]} Page={this.props.Page} Params={record} key={actionList[i].Name} />)
            else list.push(<AButton Property={actionList[i]} Page={this.props.Page} Params={record} key={actionList[i].Name} />)
        }

        return (<span>{list.map(m => m)}</span>)
    }

    InitSetView(view) {
        const properties = view.Properties || [];

        const rowDict = {};
        let xList = [];

        properties.forEach(p => {
            if (!(p.IsVisible === false)) {
                p.Id = p.Id || Common.CreateGuid()
                if (rowDict[p.X] === undefined) { rowDict[p.X] = []; xList.push({ RowId: p.RowId, X: p.X }); }
                rowDict[p.X].push(p)
            }
        });

        xList = xList.sort((a, b) => a.X > b.X ? 1 : -1);

        for (let key in rowDict) rowDict[key] = rowDict[key].sort((a, b) => a.Y > b.Y ? 1 : -1);

        return { XList: xList, RowDictionary: rowDict, IsVisible: view.IsVisible };
    }

    RenderView(view) {
        return (
            <div style={{ display: view.IsVisible ? "" : "none" }}>
                {view.XList.map(m => this.RendRowCols(m.RowId, view.RowDictionary[m.X]))}
            </div>
        );
    }

    RendRowCols(rowId, colList) {
        return (<Row key={rowId} type="flex" justify="start" align="top" gutter={16}>{colList.map(c => this.RenderColumn(c))}</Row>);
    }

    RenderColumn(col) {
        return (<Col key={col.ColId} span={col.ColSpan}>{this.GetPropertyItem(col)}</Col>);
    }

    GetPropertyItem(p) {
        return (<PropertyItem Property={p} Page={this.props.Page} />)
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined) {
                if (this.props[key] !== nextProps[key]) { blChangedProps = true; break; }
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
    }

    SetDataPropert(p) {
        if (p.IsCurrency && p.Render === undefined) {
            p.Render = (text, record) => {
                if (parseFloat(text) < 0) return <SpanText Style={{ color: "red" }} Text={Common.ToCurrency(text)} />
                return Common.ToCurrency(text)
            };
        }
        return p;
    }
}