import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Form } from "antd"

export default class PropertyItem extends Index {
    constructor(props) {
        super(props)
    }

    render() {
        const { Property } = this.props

        const labelCol = Property.LabelCol || 6;
        const wrapperCol = Property.WrapperCol || 18;

        if (Common.IsNullOrEmpty(Property.Label)) {
            return (<Form.Item>{this.GetReactComponent(Property)}</Form.Item>)
        }
        else {
            return (<Form.Item label={Property.Label}
                labelCol={{ span: labelCol }} required={Property.IsEdit && !Property.IsNullable}
                wrapperCol={{ span: wrapperCol }} >{this.GetReactComponent(Property)}</Form.Item>)
        }
    }
}