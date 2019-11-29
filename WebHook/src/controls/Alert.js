import { useMemo, useState } from "react"
import BaseIndex from "./BaseIndex"
import { Alert } from "antd"
import { Common } from "UtilsCommon";

export default (props) => {
    const instance = useMemo(() => new Alert2(), []);

    instance.Init(props);

    instance.InitState("IsVisible", useState(instance.InitialState.IsVisible))

    return instance.render();
}

class Alert2 extends BaseIndex {

    render() {
        if (!this.state.IsVisible) return null;

        const showIcon = !Common.IsNullOrEmpty(this.state.Value);

        return <Alert message={this.state.Value} type="info" showIcon={showIcon} style={{ marginBottom: 8, marginTop: 8, height: 40 }} />
    }
}