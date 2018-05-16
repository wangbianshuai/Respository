import React from "react"
import Index from "./Index"

export default class Panel extends Index {
    constructor(props) {
        super(props)

        this.Name = "Panel";
    }

    render() {
        return (<div>{this.props.PageName}</div>)
    }
}