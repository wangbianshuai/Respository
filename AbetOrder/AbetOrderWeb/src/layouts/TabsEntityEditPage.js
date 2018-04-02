import React from "react"
import { Tabs } from "antd";
import * as Common from "../utils/Common"
import EntityEditPage from "./EntityEditPage"
import Index from "./Index"

export default class TabsEntityEditPage extends Index {
    constructor(props) {
        super(props)

        this.Name = "TabsEntityEditPage";
    }

    componentWillMount() {
        const operationView = this.props.Property.OperationView || [];

        const { PrimaryKey } = this.props.Property;
        const { QueryString, EventActions } = this.props.Page;
        const id = Common.GetObjValue(QueryString, PrimaryKey);
        if (!Common.IsNullOrEmpty(id) && operationView.Properties) {
            operationView.Properties.forEach(p => { if (p.IsEditEnable) p.IsVisible = true; });
        }

        this.OperationView = this.InitSetView(operationView);

        if (!Common.IsNullOrEmpty(id)) {
            EventActions.EntityEdit.GetEntityDataById(id);
        }
    }

    RenderTabPanel(view) {
        const props = { Page: this.props.Page, Property: view }

        return <Tabs.TabPane tab={view.TabLabel} key={view.Id}><EntityEditPage {...props} /></Tabs.TabPane>
    }

    render() {
        return (
            <div>
                {this.RenderView(this.OperationView)}
                <Tabs>
                    {this.props.Property.TabViews.map(m => this.RenderTabPanel(m))}
                </Tabs>
            </div>
        );
    }
}