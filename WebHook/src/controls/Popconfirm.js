import React from "react"
import BaseIndex from "./BaseIndex"
import { Popconfirm } from "antd"

export default class Popconfirm2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "Popconfirm2";
    }

    ConfirmAction() {
        this.PageAxis.InvokeAction(this.Property.EventActionName, this.props);
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        return (
            <Popconfirm title={Property.Title} onConfirm={this.ConfirmAction.bind(this)} okText="确定" cancelText="取消">
                <a href={Property.Href}>{text}</a>
            </Popconfirm>
        )
    }
}