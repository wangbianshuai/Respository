import React, { Component } from "react"
import Controls from "Controls";
import Components from "Components"
import PageControls from "PageControls";
import { Flex } from "antd-mobile";

export default class PropertyItem extends Component {
    constructor(props) {
        super(props);

        this.Id = props.Property.Id;

        this.state = { IsVisible: props.Property.IsVisible !== false }

        if (props.Property.IsFlexItem) props.Property.SetFlexItemVisible = (v) => this.setState({ IsVisible: v })

        props.EventActions.GetReactComponent = this.GetReactComponent.bind(this);
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
        const { EventActions } = this.props
        const props = { Property: property, key: property.Id, View: view || {}, EventActions }

        return this.CreateComponent(property.Type, props);
    }

    render() {
        const { Property, View } = this.props;
        if (Property.IsFlexItem) {
            const style = Property.FlexStyle || {};
            if (!this.state.IsVisible) style.display = "none";

            return (<Flex.Item style={style}>{this.GetReactComponent(Property, View)}</Flex.Item>)
        }
        return this.GetReactComponent(Property, View);
    }
}
