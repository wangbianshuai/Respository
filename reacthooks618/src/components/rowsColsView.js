import React from "react";
import BaseIndex from "./BaseIndex";
import styles from "../styles/view.css";
import { Card, Form } from "antd";
import { Common } from "UtilsCommon";

export default class RowsColsView extends BaseIndex {
    constructor(props) {
        super(props)

        props.pageAxis.Components.push(props.property);
        props.property.ReLoad= this.componentDidMount.bind(this);
        this.InitsetView();
    }

    RenderFormView() {
        const labelAlign = this.property.LabelAlign || "right";
        return this.property.isForm ? <Form labelAlign={labelAlign}> {this.RenderView()}</Form> : this.RenderView()
    }

    componentDidMount() {
        if (this.property.EventActionName) {
            this.pageAxis.InvokeAction(this.property.EventActionName, this.props);
        }
    }

    render() {
        if (!this.state.isVisible) return null;

        if (this.property.Title) {
            return (
                <Card title={Common.replaceDataContent(this.pageAxis.PageData, this.property.Title)} style={this.property.style} bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                    {this.RenderFormView()}
                </Card>
            )
        }

        if (this.property.isDiv === false) return this.RenderFormView();

        let className = this.property.ClassName || "DivView";
        if (className && styles[className]) className = styles[className];

        return (
            <div className={className} style={this.property.style}>
                {this.RenderFormView()}
            </div>
        )
    }
}