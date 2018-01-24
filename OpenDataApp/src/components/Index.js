import React, { Component } from "react"
import * as Common from "../utils/Common"
import Button2 from "../controls/Button2"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Id || Common.CreateGuid()
    }

    GetReactComponent(property) {
        switch (property.Type) {
            case "Button": return <Button2 Config={property} key={property.Id} />
            default: return null
        }
    }
}