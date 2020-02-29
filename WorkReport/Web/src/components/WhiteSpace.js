import React, { Component } from "react"
import styles from "../styles/View.css";

export default class WhiteSpace extends Component {
    constructor(props) {
        super(props);

        this.Name = "WhiteSpace"
        this.state = { IsVisible: true }
        props.Property.SetVisible = this.SetVisible.bind(this);
    }

    SetVisible(v) {
        this.setState({ IsVisible: v })
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props;

        let className = Property.ClassName;
        if (className && styles[className]) className = styles[className];

        return (
            <div className={className} style={Property.Style}></div>
        )
    }
}