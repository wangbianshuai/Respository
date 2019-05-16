import React, { Component } from "react"
import Controls from "Controls";
import Components from "Components"
import PageControls from "PageControls";
import PageComponents from "PageComponents";
import { Common } from "UtilsCommon";
import { Form } from "antd";

export default class PropertyItem extends Component {
    constructor(props) {
        super(props);

        this.Id = props.Property.Id;

        this.state = { IsVisible: props.Property.IsVisible !== false }

        if (props.Property.IsFormItem) props.Property.SetFormItemVisible = (v) => this.setState({ IsVisible: v })

        props.EventActions.GetReactComponent = this.GetReactComponent.bind(this);
    }

    CreateComponent(type, props) {
        if (Components[type]) return React.createElement(Components[type], props);
        else if (Controls[type]) return React.createElement(Controls[type], props);
        else if (PageComponents[type]) return React.createElement(PageComponents[type], props);
        else if (PageControls[type]) return React.createElement(PageControls[type], props);
        else return null;
    }

    GetReactComponent(property, view) {
        const { EventActions } = this.props
        const props = { Property: property, key: property.Id, View: view || {}, EventActions }

        return this.CreateComponent(property.Type, props);
    }

    RenderLabel() {
        const { Property } = this.props;

        if (Property.IsAddOptional) {
            const exLabel = Property.ExLabel || "";
            return <React.Fragment>{Property.Label}<span style={{ color: "#999999" }}>（选填）</span>{exLabel}</React.Fragment>
        }

        return Property.Label;
    }

    render() {
        const { Property, View } = this.props;
        const labelCol = Property.LabelCol || 6;
        const wrapperCol = Property.WrapperCol || 18;

        if (Property.IsFormItem) {
            const style = Property.Style || {};
            if (!this.state.IsVisible) style.display = "none";

            if (Common.IsNullOrEmpty(Property.Label)) {
                return (<Form.Item style={style}>{this.GetReactComponent(Property, View)}</Form.Item>)
            }
            else {
                return (<Form.Item label={this.RenderLabel()} style={style} colon={Property.IsColon !== false}
                    labelCol={{ span: labelCol }} required={Property.IsEdit && !Property.IsNullable}
                    wrapperCol={{ span: wrapperCol }} >{this.GetReactComponent(Property, View)}</Form.Item>)
            }
        }
        return this.GetReactComponent(Property, View);
    }
}