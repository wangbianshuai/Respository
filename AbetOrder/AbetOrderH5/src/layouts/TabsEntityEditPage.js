import React from "react"
import { Tabs } from "antd";
import * as Common from "../utils/Common"
import EntityEditPage from "./EntityEditPage"
import Index from "./Index"
import PageComponent from "../pagecomponents/PageComponent"

export default class TabsEntityEditPage extends Index {
    constructor(props) {
        super(props)

        this.state = { RefreshId: Common.CreateGuid() }
    }

    componentWillMount() {
        const operationView = this.props.Property.OperationView || [];

        const { PrimaryKey } = this.props.Property;
        const { QueryString, EventActions } = this.props.Page;
        const id = Common.GetObjValue(QueryString, PrimaryKey);
        if (!Common.IsNullOrEmpty(id) && operationView.Properties) {
            operationView.Properties.forEach(p => { if (p.IsEditEnable) p.IsVisible = true; });
        }

        operationView.RefreshVisible = this.RefreshOperationViewVisible.bind(this);

        this.OperationView = this.InitSetView(operationView);

        if (!Common.IsNullOrEmpty(id)) {
            EventActions.EntityEdit.GetEntityDataById(id);
        }
    }

    RefreshOperationViewVisible() {
        const operationView = this.props.Property.OperationView || [];

        this.OperationView = this.InitSetView(operationView);

        this.setState({ RefreshId: Common.CreateGuid() })
    }

    RenderTabPanel(view) {
        const props = { Page: this.props.Page, Property: view }

        if (view.TemplateName === "EntityEditPage") return <Tabs.TabPane tab={view.TabLabel} key={view.Id}><EntityEditPage {...props} /></Tabs.TabPane>
        else if (view.PageComponentName) return this.GetPageComponent(view, props);

        return null;
    }

    GetPageComponent(view, props) {
        const c = PageComponent(view, props);
        if (c === null) return c;

        return <Tabs.TabPane tab={view.TabLabel} key={view.Id}>{c}</Tabs.TabPane>
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