import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { WhiteSpace } from "antd-mobile"

export default class WhiteSpace2 extends Index {
    constructor(props) {
        super(props)

        this.Size = "md"
    }

    render() {
        return (<WhiteSpace size={this.GetPropsValue("Size")} />)
    }
}