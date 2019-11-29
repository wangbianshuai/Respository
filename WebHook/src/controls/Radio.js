import { useMemo, useState, useEffect } from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";
import { Radio, Input } from "antd";
import { useMapToProps } from "ReactCommon";
const RadioGroup = Radio.Group
const RadioButton = Radio.Button;

export default (props) => {
    const instance = useMemo(() => new Radio2(), []);
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

class Radio2 extends BaseIndex {
    Init2(props, dispatchAction, getStateValue) {
        if (this.Init(props)) return;

        this.DispatchAction = dispatchAction;
        this.GetStateValue = getStateValue;
    }

    componentDidMount() {
        this.GetDataSource();
    }

    GetOptions() {
        const options = [];

        this.Property.DataSource.forEach(d => {
            if (this.Property.IsButton) {
                const style = {}
                if (this.Property.ButtonWidth) {
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
            if (Property.Label) {
                const text = this.GetSelectText(value);

                return <Input readOnly={this.state.IsReadOnly}
                    type="text"
                    value={text} />
            }
            else {
                return (<RadioGroup disabled={this.state.Disabled}
                    value={value} style={Property.Style}>{this.state.Options}</RadioGroup>)
            }
        }

        return (<RadioGroup disabled={this.state.Disabled}
            value={value} style={Property.Style}
            onChange={this.OnChange.bind(this)}
            defaultValue={Property.DefaultValue} >{this.state.Options}</RadioGroup>)
    }
}