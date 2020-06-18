import React from "react"
import BaseIndex from "./BaseIndex"
import { Popconfirm } from "antd"

export default class Popconfirm2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.name = "Popconfirm2";
    }

    ConfirmAction() {
        this.pageAxis.invokeEventAction(this.property.EventActionName, this.props);
    }

    render() {
        const { property } = this.props
        const text = property.label || property.text

        return (
            <Popconfirm title={property.title} onConfirm={this.ConfirmAction.bind(this)} okText="确定" cancelText="取消">
                <a href={property.href}>{text}</a>
            </Popconfirm>
        )
    }
}