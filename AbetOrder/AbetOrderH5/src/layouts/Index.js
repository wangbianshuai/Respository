import React, { Component } from "react"
import { Flex} from "antd-mobile"
import * as Common from "../utils/Common"
import PropertyItem from "../components/PropertyItem"
import AButton from "../controls/AButton"
import Popconfirm2 from "../controls/Popconfirm2"
import SpanText from "../controls/SpanText"
import { Link } from "dva/router";
import styles from "../styles/Index.css"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = Common.CreateGuid();
    }

    RenderActions(actionList, record) {
        const list = []

        for (let i = 0; i < actionList.length; i++) {
            if (i > 0) list.push(<Flex type="vertical" key={i} />)
            if (actionList[i].IsConfrim) list.push(<Popconfirm2 Property={actionList[i]} Page={this.props.Page} View={this.props.Property} Params={record} key={actionList[i].Name} />)
            else if (actionList[i].IsToPage) list.push(this.GetLinkAction(actionList[i], record));
            else list.push(<AButton Property={actionList[i]} Page={this.props.Page} View={this.props.Property} Params={record} key={actionList[i].Name} ClickAction={actionList[i].ClickAction} />)
        }

        return (<span>{list.map(m => m)}</span>)
    }

    GetLinkAction(p, record) {
        const text = p.Text;
        if (!Common.IsNullOrEmpty(text)) {
            let url = p.PageUrl, v;

            p.PropertyNames.forEach(n => {
                v = record[n];
                url = url.replace("{" + n + "}", escape(v));
            })

            url = Common.AddUrlRandom(url);

            return <Link to={url} key={p.Name}>{text}</Link>
        }
        return text;
    }

    InitSetView(view) {
        const properties = view.Properties || [];

        const rowDict = {};
        let xList = [];

        properties.forEach(p => {
            if (!(p.IsVisible === false) && p.IsDataRight !== false) {
                p.Id = p.Id || Common.CreateGuid()
                if (rowDict[p.X] === undefined) { rowDict[p.X] = []; xList.push({ RowId: p.RowId, X: p.X }); }
                rowDict[p.X].push(p)
            }
        });

        xList = xList.sort((a, b) => a.X > b.X ? 1 : -1);

        for (let key in rowDict) rowDict[key] = rowDict[key].sort((a, b) => a.Y > b.Y ? 1 : -1);

        return { XList: xList, RowDictionary: rowDict, IsVisible: view.IsVisible, View: view };
    }

    RenderView(view) {
        if (Common.IsEmptyObject(view)) return null;
        return (
            <div style={{ display: view.IsVisible ? "" : "none" }}>
                {view.XList.map(m => this.RendRowCols(view.View, m.RowId, view.RowDictionary[m.X]))}
            </div>
        );
    }

    RendRowCols(view, rowId, colList) {
        return (<Flex key={rowId} type="flex" justify="start" align="top" gutter={16}>{colList.map(c => this.RenderColumn(view, c))}</Flex>);
    }

    RenderColumn(view, col) {
        return (<Flex key={col.ColId} span={col.ColSpan}>{this.GetPropertyItem(view, col)}</Flex>);
    }

    GetPropertyItem(view, p) {
        return (<PropertyItem Property={p} Page={this.props.Page} View={view} />)
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

    SetDataProperty(p) {
        if (p.IsCurrency && p.Render === undefined) {
            p.Render = (text, record) => {
                if (parseFloat(text) < 0) return <SpanText Style={{ color: "red" }} Text={Common.ToCurrency(text, p.IsFixed2)} />

                if (p.FontColor) return <SpanText Style={{ color: p.FontColor }} Text={Common.ToCurrency(text, p.IsFixed2)} />

                return Common.ToCurrency(text, p.IsFixed2)
            };
        }
        else if (p.IsDate && p.Render === undefined) {
            p.Render = (text, record) => {
                if (!Common.IsNullOrEmpty(text)) text = text.substr(0, 10);
                return text;
            };
        }
        else if (p.IsToPage && p.Render === undefined) {
            p.Render = (text, record) => {
                if (!Common.IsNullOrEmpty(text)) {
                    const dataValue = record[p.PropertyName];
                    let url = p.PageUrl.replace("{" + p.PropertyName + "}", escape(dataValue));
                    url = Common.AddUrlRandom(url);

                    return <Link to={url}>{text}</Link>
                }
                return text;
            };
        }
        else if (p.IsOpenPage && p.Render === undefined) {
            p.Render = (text, record) => {
                if (!Common.IsNullOrEmpty(text)) {
                    let url = "";
                    const dataValue = record[p.PropertyName];
                    if (dataValue) url = p.PageUrl.replace("{" + p.PropertyName + "}", p.IsEscape === false ? dataValue : escape(dataValue));

                    if (p.IsAddToken) {
                        const { LoginUser } = this.props.Page;
                        url = Common.AddUrlParams(url, "LoginUserId", LoginUser.UserId)
                        url = Common.AddUrlParams(url, "Token", LoginUser.Token)
                    }
                    if (p.IsRandom !== false) url = Common.AddUrlRandom(url);

                    if (Common.IsNullOrEmpty(url)) return text;
                    else {
                        if (url.toLowerCase().indexOf("http") !== 0) url = Common.DataApiUrl.replace("api/", "") + url;
                        return <a href={url} target="_blank">{text}</a>
                    }
                }
                return text;
            };
        }
        else if (p.IsTooltip && p.Render === undefined) {
            p.Render = (text, record) => {
                if (!Common.IsNullOrEmpty(text)) {
                    return (<Flex title={text}>
                        <span className={styles.TooltipSpan} style={{ width: p.ColumnWidth }}>{text}</span>
                    </Flex>)
                }
                return text;
            };
        }
        return p;
    }
}