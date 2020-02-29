import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { MapToProps } from "ReactCommon";
import { AutoComplete } from "antd"

class AutoComplete2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [], InputValue: "" }, this.state)

        this.Property.GetSelectData = () => this.GetSelectData(this.state.Value);
    }

    componentDidMount() {
        this.GetDataSource();
    }

    GetOptions(parentValue) {
        const options = [];

        Common.IsArray(this.Property.DataSource) && this.Property.DataSource.forEach(d => {
            this.JudgePush(d, parentValue) && options.push(d[this.TextName])
        });

        return options;
    }

    OnChange(value) {
        this.IsLoadValue = true;
        this.setState({ Value: value }, () => this.BindDataValue())
    }

    OnSearch(value) {
        this.setState({ InputValue: value })
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);

        if (this.Property.SelectDataToProperties) this.SetSelectDataToProperties(this.GetSelectData(value));
    }

    GetSelectData(value) {
        if (Common.IsNullOrEmpty(value)) return null;

        return Common.ArrayFirst(this.Property.DataSource, f => Common.IsEquals(f[this.TextName], value));
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props

        const width = Property.Width || "100%"

        const value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        const { InputValue, Options } = this.state;
        var dataSource = InputValue ? Options : [];

        return (<AutoComplete placeholder={Property.PlaceHolder}
            style={{ width: width }}
            onChange={this.OnChange.bind(this)}
            maxLength={Property.MaxLength}
            readOnly={this.state.IsReadOnly}
            dataSource={dataSource}
            disabled={this.state.Disabled}
            onSearch={this.OnSearch.bind(this)}
            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            value={value} />)
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        GetStateValue: owner.GetStateValue
    }
}

export default MapToProps(setProps)(AutoComplete2);