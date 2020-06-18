import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { MapToProps } from "UseHooks";
import { Checkbox } from "antd"

class CheckBoxGroup2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)
    }

    componentDidMount() {
        this.getDataSource();
    }

    getOptions() {
        const options = [];

        this.property.DataSource.forEach(d => {
            options.push({ value: d[this.ValueName], label: d[this.TextName] });
        });

        return options;
    }

    CheckBoxChange(value) {
        this.isLoadValue = true;
        if (this.property.isSingleSelection && value && value.length > 1) value = [value[value.length - 1]];

        this.setState({ Value: value });
    }

    render() {
        if (!this.state.isVisible) return null;
        
        const { property } = this.props

        let valueList = Common.isNullOrEmpty(this.state.Value) ? [] : this.state.Value;
        if (!Common.isArray(valueList)) valueList = valueList.split(",")

        let styles;
        if (property.isFlexColumn) {
            styles = {
                display: "flex",
                flexDirection: "column",
                lineHeight: "32px"
            };
        }

        if (this.state.isReadOnly) {
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
        getStateValue: owner.getStateValue
    }
}

//export default MapToProps(setProps)(CheckBoxGroup2);

export default (props)=>{

    return <Checkbox.Group></Checkbox.Group>
};