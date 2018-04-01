import React from "react"
import { Card } from "antd"
import * as Common from "../utils/Common"
import ComplexDataGrid from "./ComplexDataGrid"
import Index from "./Index"

export default class EntityEditPage extends Index {
    constructor(props) {
        super(props)

        this.Name = "EntityEditPage";
    }

    componentWillMount() {
        const eidtView = this.props.Property.EditView || [];

        if (!this.props.Property.IsTabView) {
            const operationView = this.props.Property.OperationView || [];

            const { PrimaryKey } = this.props.Property;
            const { QueryString, EventActions } = this.props.Page;
            const id = Common.GetObjValue(QueryString, PrimaryKey);
            if (!Common.IsNullOrEmpty(id) && operationView.Properties) {
                operationView.Properties.forEach(p => { if (p.IsEditEnable) p.IsVisible = true; });
            }

            this.OperationView = this.InitSetView(operationView);
        }

        this.EditView = this.InitSetView(eidtView)

        if (!Common.IsNullOrEmpty(id) && !this.props.Property.IsTabView) {
            EventActions.EntityEdit.GetEntityDataById(id);
        }
    }

    RenderEditView() {
        if (!Common.IsNullOrEmpty(this.props.Property.EditView.Title)) {
            return <Card title={this.props.Property.EditView.Title} bordered={false}>{this.RenderView(this.EditView)}</Card>
        }
        else return this.RenderView(this.EditView)
    }

    RenderComplexView() {
        if (!this.props.Property.ComplexView) return null;

        return <ComplexDataGrid Property={this.props.Property.ComplexView} Page={this.props.Page} />
    }

    render() {
        return (
            <div>
                {this.RenderView(this.OperationView)}
                {this.RenderEditView()}
                {this.RenderComplexView()}
            </div>
        );
    }
}