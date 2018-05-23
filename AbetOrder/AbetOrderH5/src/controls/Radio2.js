import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Radio, InputItem } from "antd-mobile"
const RadioGroup = Radio.Group
const RadioButton = Radio.Button;

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
            if (this.Property.IsButton) {
                const style = {}
                if (this.Property.ButtonWidth > 0) {
                    style.width = this.Property.ButtonWidth;
                    style.textAlign = "center";
                }
                options.push(<RadioButton style={style} value={d[this.ValueName]} key={d[this.ValueName]}>{d[this.TextName]}</RadioButton>)
            }
            else options.push(<Radio value={d[this.ValueName]} key={d[this.ValueName]}>{d[this.TextName]}</Radio>)
        });

        return options;
    }

    OnChange(e) {
        this.setState({ Value: e.target.value })
    }

    GetSelectText(value) {
        const d = Common.ArrayFirst(this.Property.DataSource, (f) => Common.IsEquals(f[this.ValueName], value));
        return d === null ? "" : d[this.TextName]
    }

    render() {
        const { Property } = this.props

        const value = Common.IsNullOrEmpty(this.state.Value) ? undefined : this.state.Value.toString()

        if (this.state.IsReadonly) {
            const text = this.GetSelectText(value);

            return <InputItem editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                type="text"
                value={text}>{Property.Label}</InputItem>
        }

        return (<RadioGroup disabled={this.state.Disabled}
            value={value}
            onChange={this.OnChange.bind(this)}
            defaultValue={Property.DefaultValue} >{this.state.Options}</RadioGroup>)
    }
}