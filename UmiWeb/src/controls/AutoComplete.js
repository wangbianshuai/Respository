import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { MapToProps } from "ReactCommon";
import { AutoComplete } from "antd"

class AutoComplete2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)
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
        this.setState({ Value: value }, () => this.BindDataValue())
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);
    }

    render() {
        if (!this.state.IsVisible) return null;
        
        const { Property } = this.props

        const width = Property.Width || "100%"

        const value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        return (<AutoComplete placeholder={Property.PlaceHolder}
            style={{ width: width }}
            onChange={this.OnChange.bind(this)}
            maxLength={Property.MaxLength}
            readOnly={this.state.IsReadOnly}
            dataSource={this.state.Options}
            disabled={this.state.Disabled}
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