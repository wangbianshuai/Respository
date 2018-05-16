import React from "react"
import Index from "./Index"
import { Modal } from "antd-mobile"

export default class Popconfirm2 extends Index {
    constructor(props) {
        super(props)

        this.Name = "Popconfirm2";
    }

    ConfirmAction() {
        const { Page, Property, Params } = this.props
        Page.InvokeAction(Property, Params);
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        return (
            <Modal title={Property.Title} onConfirm={this.ConfirmAction.bind(this)} okText="确定" cancelText="取消">
                <a>{text}</a>
            </Modal>
        )
    }
}