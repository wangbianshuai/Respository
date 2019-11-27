import React from "react";
import BaseIndex from "./BaseIndex";
import styles from "../styles/View.css";
import { Card, Form } from "antd";
import { Common } from "UtilsCommon";

export default class RowsColsView extends BaseIndex {
    constructor(props) {
        super(props)

        props.PageAxis.Components.push(props.Property);
        props.Property.ReLoad= this.componentDidMount.bind(this);
        this.InitSetView();
    }

    RenderFormView() {
        const labelAlign = this.Property.LabelAlign || "right";
        return this.Property.IsForm ? <Form labelAlign={labelAlign}> {this.RenderView()}</Form> : this.RenderView()
    }

    componentDidMount() {
        if (this.Property.EventActionName) {
            this.PageAxis.InvokeAction(this.Property.EventActionName, this.props);
        }
    }

    render() {
        if (!this.state.IsVisible) return null;

        if (this.Property.Title) {
            return (
                <Card title={Common.ReplaceDataContent(this.PageAxis.PageData, this.Property.Title)} style={this.Property.Style} bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                    {this.RenderFormView()}
                </Card>
            )
        }

        if (this.Property.IsDiv === false) return this.RenderFormView();

        let className = this.Property.ClassName || "DivView";
        if (className && styles[className]) className = styles[className];

        return (
            <div className={className} style={this.Property.Style}>
                {this.RenderFormView()}
            </div>
        )
    }
}