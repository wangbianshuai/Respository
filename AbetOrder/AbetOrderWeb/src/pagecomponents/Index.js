import { Component } from "react"
import * as Common from "../utils/Common"
import { Row, Col } from "antd"
import PropertyItem from "../components/PropertyItem"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Id || Common.CreateGuid();

        this.Property = props.Property;
        this.Page = props.Page;

        if (this.Property) {
            this.Property.SetValue = (value) => this.SetValue(value);
            this.Property.GetValue = () => this.GetValue();
        }
    }

    SetValue(value) { }

    GetValue() { }

    componentWillUnmount() {
        this.IsDestory = true;
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

    GetDataSource(property, actionName, stateName, fn, action) {
        const { Page } = this.props;

        property.Id = property.Id || Common.CreateGuid();
        property.DataSource = []

        property.ActionType = "Page";
        property.ActionName = "GetServiceDataSource"

        property.SetDataSource = (dataList) => {
            if (this.IsDestory) return;
            if (fn) fn(dataList);
            else {
                const data = {}; data[stateName] = dataList;
                this.setState(data);
            }
        };

        action = action || Page.GetAction(actionName);

        if (property.IsInitState) this.Page.SetActionState(action);

        if (action.IsFirst === undefined) action.IsFirst = true;

        const list = action.IsFirst || property.IsInitState ? undefined : Page.props[action.StateName];
        if (list === undefined) Page.InvokeAction(property, action);
        else property.SetDataSource(list);

        action.IsFirst = false;
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
        return (<Row key={rowId} type="flex" justify="start" align="top" gutter={16}>{colList.map(c => this.RenderColumn(view, c))}</Row>);
    }

    RenderColumn(view, col) {
        return (<Col key={col.ColId} span={col.ColSpan}>{this.GetPropertyItem(view, col)}</Col>);
    }

    GetPropertyItem(view, p) {
        return (<PropertyItem Property={p} Page={this.props.Page} View={view} />)
    }

}