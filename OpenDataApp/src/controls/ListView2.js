import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { ListView } from "antd-mobile"

export default class ListView2 extends Index {
    constructor(props) {
        super(props)
    }

    render() {
        return (<ListView />)
    }
}