import { useMemo, useState } from "react"
import BaseIndex from "./BaseIndex"
import { Button } from "antd"

export default (props) => {
    const instance = useMemo(() => new Button2(), []);

    instance.Init2(props);

    const { Disabled, IsVisible, Loading, Text, BututonType } = instance.state;

    instance.InitState("Disabled", useState(Disabled))
    instance.InitState("IsVisible", useState(IsVisible))
    instance.InitState("Loading", useState(Loading))
    instance.InitState("Text", useState(Text))
    instance.InitState("BututonType", useState(BututonType))

    return instance.render();
}

class Button2 extends BaseIndex {
    Init2(props) {
        if (this.Init(props)) return;

        this.state = {
            Disabled: this.Property.Disabled === undefined ? false : this.Property.Disabled,
            IsVisible: this.Property.IsVisible !== false && this.Property.IsDataRight !== false,
            Loading: false,
            Text: this.Property.Text,
            BututonType: this.Property.ButtonType
        };

        this.Property.SetLoading = (loading) => this.setState({ Loading: loading });
        this.Property.SetTextType = (text, type) => this.setState({ Text: text, BututonType: type || this.Property.ButtonType });
    }

    ClickAction() {
        this.PageAxis.InvokeEventAction(this.Property.EventActionName, this.props);
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Loading, Text, BututonType } = this.state;
        const { Property } = this.props

        return (<Button onClick={this.ClickAction.bind(this)}
            icon={Property.Icon}
            disabled={this.state.Disabled}
            style={Property.Style}
            shape={Property.Shape}
            loading={Loading}
            size={Property.Size}
            prefix={this.RenderPrefix()}
            type={BututonType}>{Text}</Button>)
    }
}