import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { SearchBar } from "antd-mobile"

export default class SearchBar2 extends Index {
    constructor(props) {
        super(props)
    }

    render() {
        return (<SearchBar placeholder={this.GetPropertyValue("PlaceHolder")} maxLength={this.GetPropertyValue("MaxLength")} />)
    }
}