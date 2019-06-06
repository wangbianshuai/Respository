import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { MapToProps } from "ReactCommon";
import { Picker, List, InputItem } from "antd-mobile";

class Select extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)

        this.Property.GetValue = () => this.GetSelectValue(true);

        this.Property.GetText = () => this.GetSelectText();
    }

    componentDidMount() {
        this.GetDataSource();
    }

    GetOptions(parentValue) {
        const options = [];
        this.ValueList = [];

        let value = null;

        Common.IsArray(this.Property.DataSource) && this.Property.DataSource.forEach(d => {
            value = d[this.ValueName]

            if (this.JudgePush(d, parentValue)) {
                options.push({ value: value, label: d[this.TextName] })
                this.ValueList.push(value);
            }
        });

        return options;
    }

    OnChange(value) {
        this.IsLoadValue = true;
        this.setState({ Value: value[0] }, () => this.BindDataValue());
    }

    ValueChange(value) {
        const { Property } = this.props
        if (Property.ValueChange) Property.ValueChange(value, this.GetSelectData(value));

        this.ChildPropertiesChanged(value);
    }

    GetSelectValue(blGet) {
        let value = Common.IsNullOrEmpty(this.state.Value) ? undefined : this.state.Value.toString()
        if (!Common.IsNullOrEmpty(value) && Common.IsArray(this.ValueList)) value = Common.ArrayFirst(this.ValueList, (f) => Common.IsEquals(f, value, true));
        if (blGet) return value === undefined ? "" : value;
        if (Common.IsNullOrEmpty(value)) {
            const { EmptyOption } = this.Property;
            if (EmptyOption) return EmptyOption.Value;
            else return ""
        }
        return value;
    }

    GetSelectText() {
        const selectData = this.GetSelectData(this.state.Value);
        if (selectData === null) return "";

        return selectData[this.TextName] === undefined ? "" : selectData[this.TextName];
    }

    Exists(value) {
        const option = Common.ArrayFirst(this.state.Options, (f) => Common.IsEquals(f.value, value, true));
        const blExists = !Common.IsEmptyObject(option);
        if (!blExists && !Common.IsNullOrEmpty(this.state.Value)) this.ValueChange(null);
        return blExists;
    }

    render() {
        const { Property } = this.props
        const { IsVisible } = this.state;

        const style = Property.Style = {};

        if (IsVisible === false) style.display = "none";

        if (this.state.IsReadonly) {
            const text = this.GetSelectText();

            return <InputItem editable={!this.state.IsReadonly}
                type="text"
                style={style}
                value={text}>{Property.Label}</InputItem>
        }

        const value = this.GetSelectValue();

        let value2 = Common.IsNullOrEmpty(value) ? [] : [value];

        const extra = "请选择" + (Property.IsNullable === false ? "" : "(可选)");

        if (!this.Exists(value)) value2 = [];

        return (
            <div className={Property.ClassName} style={style}>
                <Picker disabled={this.state.Disabled}
                    value={value2}
                    cascade={false}
                    onChange={this.OnChange.bind(this)}
                    onOk={this.OnChange.bind(this)}
                    data={[this.state.Options]}
                    title={Property.Label}
                    extra={extra}
                    defaultValue={Property.DefaultValue}>
                    <List.Item arrow="horizontal">{Property.Label}</List.Item>
                </Picker>
            </div>
        )
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        GetStateValue: owner.GetStateValue
    }
}

export default MapToProps(setProps)(Select);