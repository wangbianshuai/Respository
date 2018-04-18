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

        this.GetDealingsUserProperty();

        this.Property.AddTabPane = (d) => this.AddTabPane(d);
    }

    AddTabPane(d) {
        const user = Common.ArrayFirst(this.state.DealingsUserList, (f) => f.DealingsUser === d.DealingsUser);
        if (user === null) {
            this.DealingsUser2Property.DefaultValue = d.DealingsUser;
            this.DealingsUserEditProperty.Value2 = d.DealingsUser;

            const list = this.state.DealingsUserList.map(m => m)
            list.push(d);

            this.setState({ DealingsUserList: list, TabsActiveKey: d.DealingsUser });
        }
    }

    GetDealingsUserList() {
        const action = this.Page.GetAction("GetDealingsUserList");

        const userId = this.Page.LoginUser.UserId;

        action.Url = `ViewDealingsBillUser?$orderby=UserType,DealingsUser&$filter=CreateUser eq '${userId}'`;

        this.GetDataSource({}, "GetDealingsUserList", "DealingsUserList", (list) => {
            this.SetDealingsUserList(list);
        }, action);
    }

    GetDealingsUserProperty() {
        this.DealingsUser2Property = this.Property.DefaultConditions[1];
        this.DealingsUserEditProperty = Common.ArrayFirst(this.Property.EditView.Properties, (f) => f.Name === "DealingsUser");
    }

    QueryData(activeKey) {
        if (Common.IsNullOrEmpty(activeKey)) return;

        !this.DealingsUser2Property && this.GetDealingsUserProperty();
        this.DealingsUser2Property.DefaultValue = activeKey;
        this.DealingsUserEditProperty.Value2 = activeKey;
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

    RenderDataView(d) {
        if (d.DealingsUser !== this.state.TabsActiveKey) return null;

        let dataPropertyList = this.props.DataProperties;

        if (d.UserType === 2) dataPropertyList = dataPropertyList.filter(f => f.Name !== "OrderName2" && f.Name !== "CreateUserName" && f.Name !== "ApproveUserName");

        return (<DataGridView Page={this.props.Page} DataList={this.props.DataList} PageInfo={this.props.PageInfo}
            TableScroll={this.props.TableScroll} ExpandedRowRender={this.props.ExpandedRowRender}
            PageIndexChange={this.props.PageIndexChange.bind(this)} GroupByInfo={this.props.GroupByInfo} GroupByInfoHtml={this.props.Property.GroupByInfoHtml}
            IsLoading={this.props.IsDataLoading} DataProperties={dataPropertyList} />)
    }

    RenderTabPanel(d) {
        const tab = d.UserType === 1 ? d.DealingsUserName : "与" + d.DealingsUserName + "的往来";
        return <Tabs.TabPane tab={tab} key={d.DealingsUser}>
            {this.RenderDataView(d)}
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