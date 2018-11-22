import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Button } from "antd-mobile"

export default class Button2 extends Index {
    constructor(props) {
        super(props)
    }

    ClickAction() {
        const { Page, Property } = this.props
        const { ActionSteps } = Property

        const actionName = ActionSteps[0]
        const action = Page.GetAction(actionName)
        //if (action != null) Page.PageAction.Alert(action)
    }

    render() {
        const { Property } = this.props

        return (<Button onClick={this.ClickAction.bind(this)}>{Property.Text}</Button>)
    }
}