import { useMemo, useState, useEffect } from "react";
import styles from "../styles/View.css";
import { Card, Form } from "antd";
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";

export default (props) => {
    const instance = useMemo(() => new RowsColsView(), []);

    instance.Init2(props);

    instance.InitState("IsVisible", useState(true));

    useEffect(() => { instance.componentDidMount() }, [instance])

    return instance.render();
}

class RowsColsView extends BaseIndex {

    Init2(props) {
         if (this.Init(props)) return;

        props.PageAxis.Components.push(props.Property);
        props.Property.ReLoad = this.componentDidMount.bind(this);
        this.InitSetView();
    }

    RenderFormView() {
        const labelAlign = this.Property.LabelAlign || "right";
        return this.Property.IsForm ? <Form labelAlign={labelAlign}> {this.RenderView()}</Form> : this.RenderView()
    }

    componentDidMount() {
        if (this.Property.EventActionName) {
            this.PageAxis.InvokeEventAction(this.Property.EventActionName, this.props);
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