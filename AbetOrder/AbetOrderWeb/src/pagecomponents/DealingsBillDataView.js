import React from "react";
import Index from "./Index";
import { Tabs } from "antd";
import DataGridView from "../components/DataGridView";
import * as Common from "../utils/Common";

export default class DealingsBillDataView extends Index {
    constructor(props) {
        super(props)
        this.state = { DealingsUserList: [], TabsActiveKey: "" }
    }

    componentWillMount() {
        this.GetDealingsUserList();
        this.DealingsUser2Property = this.Property.DefaultConditions[1];
    }

    GetDealingsUserList() {
        const action = this.Page.GetAction("GetDealingsUserList");
        const userId = this.Page.LoginUser.UserId;
        action.Url = `ViewDealingsBillUser?$orderby=DealingsUser&$filter=CreateUser eq '${userId}'`;

        this.GetDataSource({}, "GetDealingsUserList", "DealingsUserList", (list) => {
            this.SetDealingsUserList(list);
        }, action);
    }

    QueryData(activeKey) {
        if (Common.IsNullOrEmpty(activeKey)) return;
        this.DealingsUser2Property.DefaultValue = activeKey;
        this.Page.EventActions.Query.SearchData(this.Property.SearchButton);
    }

    SetDealingsUserList(list) {
        let key = list.length > 0 ? list[0].DealingsUser : "";
        if (!Common.IsNullOrEmpty(this.state.TabsActiveKey)) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].DealingsUser === this.state.TabsActiveKey) { key = list[i].DealingsUser; break; }
            }
        }
        this.setState({ DealingsUserList: list, TabsActiveKey: key });
        this.QueryData(key);
    }

    RenderDataView() {
        return (<DataGridView Page={this.props.Page} DataList={this.props.DataList} PageInfo={this.props.PageInfo}
            TableScroll={this.props.TableScroll} ExpandedRowRender={this.props.ExpandedRowRender}
            PageIndexChange={this.props.PageIndexChange.bind(this)} GroupByInfo={this.props.GroupByInfo} GroupByInfoHtml={this.props.Property.GroupByInfoHtml}
            IsLoading={this.props.IsDataLoading} DataProperties={this.props.DataProperties} />)
    }

    RenderTabPanel(d) {
        const tab = "与" + d.DealingsUserName + "的往来";
        return <Tabs.TabPane tab={tab} key={d.DealingsUser}>
            {this.RenderDataView()}
        </Tabs.TabPane>
    }

    TabsChange(activeKey) {
        this.setState({ TabsActiveKey: activeKey });
        this.QueryData(activeKey);
    }

    render() {
        return (
            <Tabs type="card" activeKey={this.state.TabsActiveKey} onChange={this.TabsChange.bind(this)}>
                {this.state.DealingsUserList.map(m => this.RenderTabPanel(m))}
            </Tabs>
        )
    }
}