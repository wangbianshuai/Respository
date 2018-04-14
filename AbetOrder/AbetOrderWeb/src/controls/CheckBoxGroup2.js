import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Checkbox } from "antd"

export default class CheckBoxGroup2 extends Index {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)
    }

    componentWillMount() {
        this.GetDataSource();
    }

    GetOptions() {
        const options = [];

        this.Property.DataSource.forEach(d => {
            options.push({ value: d[this.ValueName], label: d[this.TextName] });
        });

        return options;
    }

    CheckBoxChange(value) {
        this.setState({ Value: value });
    }

    render() {
        const { Property } = this.props

        let valueList = Common.IsNullOrEmpty(this.state.Value) ? [] : this.state.Value;
        if (!Common.IsArray(valueList)) valueList = valueList.split(",")

        let styles;
        if (Property.IsFlexColumn) {
            styles = {
                display: "flex",
                flexDirection: "column",
                lineHeight: "32px"
            };
        }

        if (this.state.IsReadonly) {
            let options = [];
            const ids = valueList.join(",") + ",";
            this.state.Options.forEach(r => {
                if (ids.indexOf(r.value + ",") >= 0) options.push(r);
            });

            return <Checkbox.Group value={valueList}
                style={styles}
                options={options}></Checkbox.Group>
        }
        else {
            return <Checkbox.Group value={valueList}
                style={styles}
                onChange={this.CheckBoxChange.bind(this)} options={this.state.Options}></Checkbox.Group>
        }
    }
}