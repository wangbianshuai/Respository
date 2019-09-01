import React, { Component } from "react"
import { Common } from "UtilsCommon";

export default class PressButton extends Component {
    constructor(props) {
        super(props);
        this.Id = Common.CreateGuid();

        this.View = props.View;
        this.Property = props.Property;
        this.EventActions = props.EventActions;

        this.Property.SetLoading = this.SetLoading.bind(this);

        this.state = { IsPress: false }
    }

    SetLoading(loading) {
        this.Loading = loading;
    }

    OnMouseDown(e) {
        if (this.Loading) return;
        this.setState({ IsPress: true });
    }

    OnMouseUp() {
        if (this.Loading) return;
        this.setState({ IsPress: false });
    }

    OnClick() {
        if (this.Loading) return;
        this.EventActions.InvokeAction(this.Property.EventActionName, this.props);
    }

    render() {
        const { Text, DivClassName, PressClassName, NoPressClassName } = this.props.Property;
        const { IsPress } = this.state;

        let className = DivClassName + " " + (IsPress ? PressClassName : NoPressClassName);
        className = this.EventActions.GetClassName(className);

        const Button = this.EventActions.GetClassName("Button");

        return (
            <div className={className}>
                <div className={Button} onMouseDown={this.OnMouseDown.bind(this)} onMouseOut={this.OnMouseUp.bind(this)}
                    onTouchStart={this.OnMouseDown.bind(this)} onTouchEnd={this.OnMouseUp.bind(this)} onTouchMove={this.OnMouseUp.bind(this)}
                    onMouseUp={this.OnMouseUp.bind(this)} onClick={this.OnClick.bind(this)}><span>{Text}</span></div>
            </div>
        )
    }
}