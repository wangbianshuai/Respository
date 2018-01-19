import React, { Component } from "react"
import { Toast } from "antd-mobile"
import * as Common from "../utils/Common"

export default class BasePage extends Component {
    constructor(props) {
        super(props)

        this.Name = ""
    }

    componentDidMount() {
        this.componentDidMount2 && this.componentDidMount2()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.Loading) Toast.loading("加载中……", 0)
        else if (nextProps.Loading === false) Toast.hide()

        this.componentWillReceiveProps2 && this.componentWillReceiveProps2(nextProps)
    }

    componentWillUnmount() {
        this.componentWillUnmount2 && this.componentWillUnmount2()
    }

    SetResponseMessage(d) {
        if (d && !d.IsSuccess && d.Message) { Toast.fail(d.Message); return true; }

        return false
    }

    JudgeChanged(nextProps, name) {
        return nextProps[name] !== undefined && nextProps[name] !== this.props[name]
    }

    RenderHtml() {
        return null
    }

    render() {
        return (
            <div>
                {this.RenderHtml()}
            </div>
        )
    }
}