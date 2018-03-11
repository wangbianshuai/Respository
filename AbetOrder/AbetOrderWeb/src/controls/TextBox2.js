import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Input } from "antd";
const { TextArea } = Input;

export default class TextBox2 extends Index {
    constructor(props) {
        super(props)

        this.state = { Value: props.Property.Value }

        props.Property.GetValue = () => this.state.Value;

        props.Property.SetValue = (v) => this.setState({ Value: v });
    }

    OnChange(e) {
        const v = e.target.value;
        this.setState({ Value: v })
    }

    render() {
        const { Property } = this.props

        const rows = Property.Rows || 4

        if (Property.ControlType === "TextArea") {
            return <TextArea rows={rows}
                placeholder={Property.PlaceHolder} onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength} readOnly={Property.IsReadonly}
                value={this.state.Value} />
        }

        return (
            <Input placeholder={Property.PlaceHolder} onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                readOnly={Property.IsReadonly}
                value={this.state.Value} />
        );
    }
}