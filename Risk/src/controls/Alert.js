import React from "react"
import BaseIndex from "./BaseIndex"
import { Alert } from "antd"
import { Common } from "UtilsCommon";

export default class Alert2 extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Alert2";
    }

    render() {
        if (!this.state.IsVisible) return null;
        
        const showIcon = !Common.IsNullOrEmpty(this.state.Value);

        return <Alert message={this.state.Value} type="info" showIcon={showIcon} style={{ marginBottom: 8, marginTop: 8, height: 40 }} />
    }
}