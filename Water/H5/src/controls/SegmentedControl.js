import React from "react";
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";
import { SegmentedControl } from "antd-mobile";
import { MapToProps } from "ReactCommon";

class SegmentedControl2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.ValueList = [];
        this.state = Object.assign({ Options: [] }, this.state);
    }

    componentDidMount() {
        this.GetDataSource();
    }

    GetValue() {
        if (Common.IsNullOrEmpty(this.state.Value)) return this.ValueList.length > 0 ? this.ValueList[0] : null;
        return this.state.Value;
    }

    GetOptions() {
        const options = [];
        this.ValueList = [];

        this.Property.DataSource.forEach(d => {
            options.push(d[this.TextName])
            this.ValueList.push(d[this.ValueName]);
        });

        return options;
    }

    OnChange(e) {
        this.setState({ Value: this.ValueList[e.nativeEvent.selectedSegmentIndex] })
    }

    GetSelectText(value) {
        const d = Common.ArrayFirst(this.Property.DataSource, (f) => Common.IsEquals(f[this.ValueName], value));
        return d === null ? "" : d[this.TextName]
    }

    GetSelectIndex(value) {
        for (let i = 0; i < this.ValueList.length; i++) {
            if (Common.IsEquals(this.ValueList[i] , value)) {
                return i;
            }
        }

        return 0;
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props

        const value = Common.IsNullOrEmpty(this.state.Value) ? undefined : this.state.Value;
		
        const selectedIndex = this.GetSelectIndex(value);

        return (<SegmentedControl disabled={this.state.Disabled}
            className={Property.ClassName} tintColor={Property.TintColor}
            values={this.state.Options} style={Property.Style} selectedIndex={selectedIndex}
            onChange={this.OnChange.bind(this)} />)
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        GetStateValue: owner.GetStateValue
    }
}

export default MapToProps(setProps)(SegmentedControl2);