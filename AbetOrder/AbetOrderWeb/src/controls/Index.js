import React, { Component } from "react"
import * as Common from "../utils/Common"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Property.Id || Common.CreateGuid()

        this.Property = props.Property;
    }

    GetPropsValue(name) {
        return this.props[name] || this[name]
    }

    GetPropertyValue(name) {
        return this.props.Property[name] || this[name]
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined) {
                if (this.props[key] !== nextProps[key]) { blChangedProps = true; break; }
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
    }
}