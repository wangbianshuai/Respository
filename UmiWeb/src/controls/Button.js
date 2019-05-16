import React from "react"
import BaseIndex from "./BaseIndex"
import { Button } from "antd"

export default class Button2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = {
            Disabled: this.Property.Disabled === undefined ? false : this.Property.Disabled,
            IsVisible: this.Property.IsVisible !== false && this.Property.IsDataRight !== false,
            Loading: false,
        };

        this.Property.SetLoading = (loading) => this.setState({ Loading: loading });
    }

    ClickAction() {
        this.EventActions.InvokeAction(this.Property.EventActionName, this.props);
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Loading } = this.state;
        const { Property } = this.props
        const text = Property.Text

        return (<Button onClick={this.ClickAction.bind(this)}
            icon={Property.Icon}
            disabled={this.state.Disabled}
            style={Property.Style}
            shape={Property.Shape}
            loading={Loading}
            size={Property.Size}
            type={Property.ButtonType}>{text}</Button>)
    }
}