import React from "react"
import Index from "./Index"
import { Modal, Button } from "antd-mobile"

export default class Popconfirm2 extends Index {
    constructor(props) {
        super(props)

        this.Name = "Popconfirm2";
    }

    ConfirmAction() {
        const { Page, Property, Params } = this.props
        Page.InvokeAction(Property, Params);
    }

    ClickAction() {
        const { Property } = this.props
        const title = Property.AlertTitle || "删除";

        Modal.alert(title, Property.Title, [
            { text: '取消' },
            { text: '确认', onPress: this.ConfirmAction.bind(this) },
        ])
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        return (
            <Button onClick={this.ClickAction.bind(this)}>
                {text}
            </Button>
        )
    }
}