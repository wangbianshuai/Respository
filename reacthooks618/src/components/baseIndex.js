import React, { Component } from "react";
import { Common } from "UtilsCommon";
import { Row, Col, Divider } from "antd";
import { Link } from "dva/router";
import PropertyItem from "./PropertyItem";

export default class BaseIndex extends Component {
    constructor(props) {
        super(props);

        this.id = props.property.id;
        this.property = props.property;
        this.view = props.view;
        this.pageAxis = props.pageAxis;
        this.state = { isVisible: true }
        this.property.setVisible = this.setVisible.bind(this);
    }

    setVisible(v) {
        this.property.isVisible = v;
        if (this.property.isFormItem && this.property.setFormItemVisible) this.property.setFormItemVisible(v);
        else this.setState({ isVisible: v })
    }

    JudgeChanged(nextProps, name) {
        return nextProps[name] !== undefined && !Common.isEquals(nextProps[name], this.props[name])
    }

    getPropsValue(key, defaultValue) {
        const value = this.props[key]
        return value && value.isSuccess !== false ? value : defaultValue;
    }

    isSuccessProps(key) {
        const value = this.props[key]
        return value && value.isSuccess !== false;
    }

    isSuccessNextsProps(obj) {
        let isSuccess = obj && obj.isSuccess !== false;
        if (isSuccess && obj.code !== undefined) isSuccess = Common.getIntValue(obj.code) === 0;
        if (!isSuccess && obj.message) {
            if (this.props.OperateTip) this.props.OperateTip(obj.message);
            else alert(obj.message);
        }
        return isSuccess;
    }

    isSuccessNextsProps2(obj) {
        return obj && obj.isSuccess !== false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChanged = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined && !Common.isFunction(nextProps[key]) && this.props[key] !== nextProps[key]) {
                blChanged = true; break;
            }
        }

        if (blChanged) {
            blChanged = this.ReceiveActionData(nextProps)
        }

        if (!blChanged) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key] && !Common.isFunction(nextState[key])) {
                    blChanged = true; break;
                }
            }
        }

        return blChanged
    }

    ReceiveActionData(nextProps) {
        let blChanged = true;
        if (this.ActionTypes) {
            let name = "", value = 0;
            for (let key in this.ActionTypes) {
                name = `Receive${key}`;
                value = this.ActionTypes[key];
                if (nextProps[value] !== this.props[value] && this[name]) blChanged = this[name](nextProps[value]);
            }
        }
        return blChanged;
    }

    InitsetView() {
        const rowDict = {};
        let xList = [];

        this.property.Properties.forEach(p => {
            p.id = p.id || Common.createGuid()
            if (rowDict[p.X] === undefined) { rowDict[p.X] = []; xList.push({ RowId: p.RowId, X: p.X, property: p }); }
            rowDict[p.X].push(p);
        });

        xList = xList.sort((a, b) => a.X > b.X ? 1 : -1);

        for (let key in rowDict) rowDict[key] = rowDict[key].sort((a, b) => a.Y > b.Y ? 1 : -1);

        this.property.RowsCols = { XList: xList, RowDictionary: rowDict };
    }

    RenderView() {
        const { XList, RowDictionary } = this.property.RowsCols;
        return (
            <React.Fragment>
                {XList.map(m => this.RendRowCols(m, RowDictionary[m.X]))}
            </React.Fragment>
        );
    }

    RendRowCols(row, colList) {
        const { property } = row;
        const justify = property.Justify || "start";
        const align = property.Align || "top";
        const gutter = property.Gutter || 16
        return (<Row key={row.RowId} type="flex" style={row.RowStyle} justify={justify} align={align} gutter={gutter}>{colList.map(c => this.RenderColumn(c))}</Row>);
    }

    RenderColumn(col) {
        if (col.isColVisible) return this.getPropertyItem(col);
        else return (<Col key={col.ColId} span={col.ColSpan} style={col.ColStyle}>{this.getPropertyItem(col)}</Col>);
    }

    getPropertyItem(p) {
        return (<PropertyItem property={p} pageAxis={this.pageAxis} view={this.property} key={"pt_" + p.id} />)
    }

    RenderActions(actionList, record) {
        const list = []

        for (let i = 0; i < actionList.length; i++) {
            actionList[i].Params= record;
            if (i > 0) list.push(<Divider type="vertical" key={i} />)
            if (actionList[i].isToPage) list.push(this.getLinkAction(actionList[i], record));
            else list.push(<PropertyItem property={actionList[i]} pageAxis={this.pageAxis} view={this.property} key={actionList[i].name} />)
        }

        return (<span>{list.map(m => m)}</span>)
    }

    getLinkAction(p, record) {
        const text = p.text;
        if (!Common.isNullOrEmpty(text)) {
            let url = p.PageUrl, v;

            p.PropertyNames.forEach(n => {
                v = record[n];
                url = url.replace("#{" + n + "}", escape(v));
            })

            url = Common.addUrlRandom(url);

            return <Link to={url} key={p.name}>{text}</Link>
        }
        return text;
    }

}