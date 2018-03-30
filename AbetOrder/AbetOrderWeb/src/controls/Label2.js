import React from "react"
import Index from "./Index"
import styles from "../styles/Index.css"

export default class Label2 extends Index {
    constructor(props) {
        super(props)

        this.Name = "Label2";
    }

    render() {
        const { Property } = this.props
        const blColon = Property.IsColon === undefined ? true : Property.IsColon

        let label = Property.Label;
        if (blColon) label += "：";

        return (
            <div className={styles.DivLabel2}>
                <label>{label}</label>
            </div>
        );
    }
}