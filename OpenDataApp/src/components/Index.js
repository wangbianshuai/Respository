import React, { Component } from "react"
import * as Common from "../utils/Common"
import Button2 from "../controls/Button2"
import NavBar2 from "../controls/NavBar2"
import WhiteSpace2 from "../controls/WhiteSpace2"
import SearchBar2 from "../controls/SearchBar2"

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
            case "NavBar": return <NavBar2 {...props} key={property.Id} />
            case "WhiteSpace": return <WhiteSpace2 {...props} key={property.Id} />
            case "SearchBar": return <SearchBar2 {...props} key={property.Id} />
            default: return null
        }
    }


}