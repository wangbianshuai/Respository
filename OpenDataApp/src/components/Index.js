import React, { Component } from "react"
import * as Common from "../utils/Common"
import Button2 from "../controls/Button2"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Id || Common.CreateGuid()
    }

    GetReactComponent(property) {
        const props = { ParentComponent: this, Property: property }
        for (var key in this.props) if (key !== "Property") props[key] = this.props[key]

        switch (property.Type) {
            case "Button": return <Button2 {...props} key={property.Id} />
            default: return null
        }
    }
}