import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Popconfirm } from "antd"

export default class Button2 extends Index {
    constructor(props) {
        super(props)
    }

    ConfirmAction() {
        const { Page, Property, Params } = this.props
        Page.InvokeAction(Property, Params);
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        return (
            <Popconfirm title={Property.Title} onConfirm={this.ConfirmAction.bind(this)} okText="确定" cancelText="取消">
                <a href="javascript:void(0);">{text}</a>
            </Popconfirm>
        )
    }
}