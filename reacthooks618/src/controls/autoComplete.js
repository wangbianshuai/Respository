import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { MapToProps } from "UseHooks";
import { AutoComplete } from "antd"

class AutoComplete2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [], InputValue: "" }, this.state)

        this.property.getSelectData = () => this.getSelectData(this.state.Value);
    }

    componentDidMount() {
        this.getDataSource();
    }

    getOptions(parentValue) {
        const options = [];

        Common.isArray(this.property.DataSource) && this.property.DataSource.forEach(d => {
            this.JudgePush(d, parentValue) && options.push(d[this.TextName])
        });

        return options;
    }

    OnChange(value) {
        this.isLoadValue = true;
        this.setState({ Value: value }, () => this.BindDataValue())
    }

    OnSearch(value) {
        this.setState({ InputValue: value })
    }

    ValueChange(value) {
        if (this.property.ValueChange) this.property.ValueChange(value);

        if (this.property.SelectDataToProperties) this.setSelectDataToProperties(this.getSelectData(value));
    }

    getSelectData(value) {
        if (Common.isNullOrEmpty(value)) return null;

        return Common.arrayFirst(this.property.DataSource, f => Common.isEquals(f[this.TextName], value));
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property } = this.props

        const width = property.Width || "100%"

        const value = Common.isNullOrEmpty(this.state.Value) ? "" : this.state.Value

        const { InputValue, Options } = this.state;
        var dataSource = InputValue ? Options : [];

        return (<AutoComplete placeholder={property.placeHolder}
            style={{ width: width }}
            onChange={this.OnChange.bind(this)}
            maxLength={property.MaxLength}
            readOnly={this.state.isReadOnly}
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
        getStateValue: owner.getStateValue
    }
}

//export default MapToProps(setProps)(AutoComplete2);

export default (props)=>{

    return <AutoComplete/>
};