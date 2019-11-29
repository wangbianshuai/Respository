import { useMemo, useState, useEffect } from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { useMapToProps } from "ReactCommon";
import { Checkbox } from "antd"

export default (props) => {
    const instance = useMemo(() => new CheckBoxGroup2(), []);
    const [dispatchAction, getStateValue] = useMapToProps(["DispatchAction", "GetStateValue"])

    instance.Init2(props, dispatchAction, getStateValue);

    const { Value, IsReadOnly, ClassName, Style, IsVisible } = instance.InitialState;

    instance.InitState("Value", useState(Value))
    instance.InitState("IsReadOnly", useState(IsReadOnly))
    instance.InitState("ClassName", useState(ClassName))
    instance.InitState("Style", useState(Style))
    instance.InitState("IsVisible", useState(IsVisible))

    instance.InitState("Options", useState([]))

    useEffect(() => instance.componentDidMount(), [instance])

    useEffect(() => instance.ValueChangeEffect(), [instance, instance.state.Value]);

    return instance.render();
}

class CheckBoxGroup2 extends BaseIndex {
    Init2(props, dispatchAction, getStateValue) {
        if (this.Init(props)) return;

        this.DispatchAction = dispatchAction;
        this.GetStateValue = getStateValue;

        this.Property.DataType = "Array";
        this.Property.GetValue = this.GetSelectValue.bind(this);
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
        this.IsLoadValue = true;
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