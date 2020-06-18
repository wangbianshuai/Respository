import React, { Component } from "react"
import styles from "../styles/view.css";

export default class WhiteSpace extends Component {
    constructor(props) {
        super(props);

        this.name = "WhiteSpace"
        this.state = { isVisible: true }
        props.property.setVisible = this.setVisible.bind(this);
    }

    setVisible(v) {
        this.setState({ isVisible: v })
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property } = this.props;

        let className = property.ClassName;
        if (className && styles[className]) className = styles[className];

        return (
            <div className={className} style={property.style}></div>
        )
    }
}