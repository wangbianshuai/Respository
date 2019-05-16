import React from "react";
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";
import { Radio, Input } from "antd";
import { MapToProps } from "ReactCommon";
const RadioGroup = Radio.Group
const RadioButton = Radio.Button;

class Radio2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state);
    }

    componentDidMount() {
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
        if (!this.state.IsVisible) return null;

        const { Property } = this.props

        const value = Common.IsNullOrEmpty(this.state.Value) ? undefined : this.state.Value;

        if (this.state.IsReadOnly) {
            const text = this.GetSelectText(value);

            return <Input readOnly={this.state.IsReadOnly}
                type="text"
                value={text} />
        }

        return (<RadioGroup disabled={this.state.Disabled}
            value={value} style={Property.Style}
            onChange={this.OnChange.bind(this)}
            defaultValue={Property.DefaultValue} >{this.state.Options}</RadioGroup>)
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        GetStateValue: owner.GetStateValue
    }
}

export default MapToProps(setProps)(Radio2);