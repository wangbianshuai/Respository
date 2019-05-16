import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { MapToProps } from "ReactCommon";
import { Checkbox } from "antd"

class CheckBoxGroup2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)
    }

    componentDidMount() {
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
        if (this.Property.IsSingleSelection && value && value.length > 1) value = [value[value.length - 1]];

        this.setState({ Value: value });
    }

    render() {
        if (!this.state.IsVisible) return null;
        
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

        if (this.state.IsReadOnly) {
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

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        GetStateValue: owner.GetStateValue
    }
}

export default MapToProps(setProps)(CheckBoxGroup2);