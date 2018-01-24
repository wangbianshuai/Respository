import React, { Component } from "react";
import * as Common from "../utils/Common"
import Index from "./Index"
import { Button, Toast } from "antd-mobile"

export default class Button2 extends Index {
    constructor(props) {
        super(props)
    }

    ClickAction() {
        Toast.info("测试2222")
    }

    render() {
        const { Config } = this.props

        return <Button onClick={this.ClickAction.bind(this)}>{Config.Text}</Button>
    }
}