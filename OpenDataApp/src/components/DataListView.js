import React, { Component } from "react"
import * as Common from "../utils/Common"
import { ListView2 } from "../controls/ListView2"

export default class DataListView extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Id || Common.CreateGuid()
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    RenderRow() {
        return null
    }

    render() {
        return (<ListView2 DataList={[]} RenderRow={this.RenderRow.bind(this)} />)
    }
}