import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { SegmentedControl, InputItem } from "antd-mobile"

export default class Radio2 extends Index {
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
            options.push(d[this.TextName])
        });

        return options;
    }

    OnChange(value) {
        this.setState({ Value: this.GetSelectValue(value) })
    }

    GetSelectText(value) {
        const d = Common.ArrayFirst(this.Property.DataSource, (f) => Common.IsEquals(f[this.ValueName], value));
        return d === null ? "" : d[this.TextName]
    }

    GetSelectedIndex(value) {
        let index = -1;

        for (let i = 0; i < this.Property.DataSource.length; i++) {
            if (Common.IsEquals(this.Property.DataSource[i][this.ValueName], value, true)) {
                index = i;
                break;
            }
        }

        return index;
    }

    GetSelectValue(text) {
        const d = Common.ArrayFirst(this.Property.DataSource, (f) => Common.IsEquals(f[this.TextName], text));
        return d === null ? "" : d[this.ValueName]
    }

    render() {
        const { Property } = this.props

        const value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value.toString()

        if (this.state.IsReadonly) {
            const text = this.GetSelectText(value);

            return <InputItem editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                type="text"
                value={text}>{Property.Label}</InputItem>
        }

        let selectedIndex = this.GetSelectedIndex(value);
        if (selectedIndex === -1) selectedIndex = this.GetSelectedIndex(Property.DefaultValue);

        return (<SegmentedControl disabled={this.state.Disabled}
            value={value}
            values={this.state.Options}
            selectedIndex={selectedIndex}
            onValueChange={this.OnChange.bind(this)}
        />)
    }
}