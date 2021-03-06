import React, { useMemo, useState } from "react"
import Controls from "Controls";
import Components from "Components"
import PageControls from "PageControls";
import { Common } from "UtilsCommon";
import { Form, Col } from "antd";
import BaseIndex from "./BaseIndex";

export default (props) => {
    const instance = useMemo(() => new PropertyItem(), []);

    instance.Init2(props);

    instance.InitState("IsVisible", useState(instance.GetIsVisible()));
    instance.InitState("Label", useState(props.Property.Label));

    return instance.render();
}

class PropertyItem extends BaseIndex {

    Init2(props) {
        if (this.Init(props)) return;

        this.Id = props.Property.Id;

        if (props.Property.IsFormItem) {
            props.Property.SetFormItemVisible = (v) => this.setState({ IsVisible: v });
            props.Property.SetLabel = (label) => this.setState({ Label: label })
        }

        this.SetIsReadOnly();

        props.PageAxis.GetReactComponent = this.GetReactComponent.bind(this);
    }

    //设置只读权限
    SetIsReadOnly() {
        const { Property, PageAxis } = this.props;
        let readOnly = !!Property.IsReadOnly;
        //判断是否有显示权限
        if (!readOnly && Property.ReadRightName) readOnly = !PageAxis.GetRight(Property.ReadRightName);

        if (readOnly && !Property.IsNullable) Property.IsNullable = true;
        if (readOnly && Property.PlaceHolder) Property.PlaceHolder = "";

        Property.IsReadOnly = readOnly;
    }

    //设置显示权限
    GetIsVisible() {
        const { Property, PageAxis } = this.props;
        let isVisible = Property.IsVisible !== false;

        //判断是否有显示权限
        if (isVisible) isVisible = PageAxis.GetRight(Property.Name);
        //判断多个权限名组合有否显示
        if (isVisible && Property.RightNames) {
            let visible = false;
            for (let i = 0; i < Property.RightNames.length; i++) {
                visible = PageAxis.GetRight(Property.RightNames[i]);
                if (!visible) break;
            }
            isVisible = visible;
        }

        Property.IsVisible = isVisible;

        return isVisible;
    }

    CreateComponent(type, props) {
        if (Components[type]) return React.createElement(Components[type], props);
        else if (Controls[type]) return React.createElement(Controls[type], props);
        else if (PageControls[type]) return React.createElement(PageControls[type], props);
        else return this.GetPageComponent(type, props);
    }

    GetPageComponent(type, props) {
        if (!type) return null;

        try {
            const pageComponent = require(`../page-components/${type}`).default;
            if (pageComponent) return React.createElement(pageComponent, props);
            return null;
        }
        catch (err) {
            return null
        }
    }

    GetReactComponent(property, view) {
        const { PageAxis } = this.props
        const props = { Property: property, key: property.Id, View: view || {}, PageAxis }

        return this.CreateComponent(property.Type, props);
    }

    RenderLabel() {
        const { Property } = this.props;
        const { Label } = this.state;

        if (Property.IsAddOptional) {
            const exLabel = Property.ExLabel || "";
            return <React.Fragment>{Label}<span style={{ color: "#999999" }}>（选填）</span>{exLabel}</React.Fragment>
        }

        return Label;
    }

    render() {
        const { Property } = this.props;
        if (!Property.IsColVisible) return this.RenderItem();

        var style = Property.ColStyle || {};
        if (!this.state.IsVisible) { style = { ...style }; style.display = "none"; }

        return <Col key={Property.ColId} span={Property.ColSpan} style={style}>{this.RenderItem()}</Col>
    }

    RenderItem() {
        const { Property, View } = this.props;
        const labelCol = Property.LabelCol || 6;
        const wrapperCol = Property.WrapperCol || 18;

        if (Property.IsFormItem && !Property.IsFormView) {
            var style = Property.Style || {};
            if (!this.state.IsVisible && !Property.IsColVisible) { style = { ...style }; style.display = "none"; }

            if (Common.IsNullOrEmpty(Property.Label)) {
                return (<Form.Item style={style} className={Property.FormItemClassName}>{this.GetReactComponent(Property, View)}</Form.Item>)
            }
            else {
                return (<Form.Item label={this.RenderLabel()} style={style} colon={Property.IsColon !== false}
                    labelCol={{ span: labelCol }} required={Property.IsEdit && !Property.IsNullable} className={Property.FormItemClassName}
                    wrapperCol={{ span: wrapperCol }} >{this.GetReactComponent(Property, View)}</Form.Item>)
            }
        }
        return this.GetReactComponent(Property, View);
    }
}