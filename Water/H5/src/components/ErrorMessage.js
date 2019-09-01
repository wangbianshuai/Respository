import React, { Component } from "react"

export default class ErrorMessage extends Component {
    constructor(props) {
        super(props)

        this.View = props.View;
        this.Property = props.Property;
        this.EventActions = props.EventActions;
        
        this.state = { Message: "" }
        this.props.Property.Show = (msg) => this.Show(msg);
        this.props.Property.Hide = () => this.Hide();
    }

    Show(msg) {
        msg = msg === undefined ? this.Property.ErrorMessage : msg;
        this.setState({ Message: msg })
    }

    Hide() {
        this.setState({ Message: "" })
    }

    render() {
        const { Property } = this.props;
        const { Message } = this.state;
        const clsssName = Property.ClassName || "ErrorInfo"

        return <div className={clsssName}><span>{Message}</span></div>
    }
}