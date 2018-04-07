import React from "react"
import Index from "./Index"
import { Input, InputNumber, Row, Col, Checkbox } from "antd";
import * as Common from "../utils/Common";
const { TextArea } = Input;

export default class OrderDetailItem extends Index {
    constructor(props) {
        super(props)

        this.state = Object.assign({}, props.Data, { ProcessItems: this.GetCheckBoxItems(props.ProcessItems) });
    }

    GetCheckBoxItems(list) {
        return list.map(m => { return { label: m.Name, value: m.Id } });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.ProcessItems !== this.props.ProcessItems) {
            this.setState({ ProcessItems: this.GetCheckBoxItems(nextProps.ProcessItems) })
        }
    }

    RenderInputNumber(name, placeholder, max, min, step, maxLength, readOnly) {
        let value = this.state[name];
        value = value === undefined ? "" : value;

        return <InputNumber placeholder={placeholder}
            style={{ width: "100%" }}
            onChange={this.InputNumberChange.bind(this, name)}
            maxLength={maxLength || 10}
            max={max}
            min={min}
            readOnly={readOnly}
            step={step}
            value={value} />
    }

    InputNumberChange(name, value) {
        const data = {};
        data[name] = this.GetNumberValue(name, value);
        this.props.Data[name] = data[name];
        if (this.state.DetailType === 1) this.ComputeAreaAmount(data, name)
        else if (this.state.DetailType === 2 && name === "Amount") this.props.SetTotalAmount();
        this.setState(data);
    }

    ComputeAreaAmount(data, name) {
        if (name === "DisplayIndex" || name === "Thickness") return;

        const width = this.GetNumberValue2(data, "Width");
        const height = this.GetNumberValue2(data, "Height");
        const area = this.GetNumberValue2(data, "Area");
        const price = this.GetNumberValue2(data, "Price");
        const number = this.GetNumberValue2(data, "Number");
        const amount = this.GetNumberValue2(data, "Amount");

        let area2 = area;
        if (name !== "Area") {
            area2 = width * height / 1000000;
            area2 = this.GetNumberValue("Area", area2);
            area2 = Common.GetNumber(area2 * number, 4);
            if (area !== area2) { this.props.Data.Area = area2; data.Area = area2; }
        }

        let amount2 = area2 * price;
        amount2 = this.GetNumberValue("Amount", amount2);
        if (amount !== amount2) { this.props.Data.Amount = amount2; data.Amount = amount2; }

        this.props.SetTotalAmount();
    }

    GetNumberValue2(data, name) {
        let value = data[name] || this.state[name];
        if (Common.IsNullOrEmpty(value)) return 0;

        return this.GetNumberValue(name, value);
    }

    GetNumberValue(name, value) {
        if (Common.IsNullOrEmpty(value)) return "";

        if (name === "Width" || name === "Thickness" || name === "Height" || name === "Number" || name === "Price") return Common.GetIntValue(value);

        if (name === "Amount") {
            value = Math.round(Common.GetFloatValue(value));
        }
        else if (name === "Area") {
            value = Common.GetNumber(value, 4);
            if (value < 0.1) value = 0.1000;
        }

        return value;
    }

    render() {
        return this.state.DetailType === 1 ? this.Render1() : this.Render2()
    }

    Render2() {
        return (<div>
            <Row gutter={6} style={{ padding: "8px 8px" }}>
                <Col span={2}>
                    {this.RenderInputNumber("DisplayIndex", "", 99, 1, 1, 2)}
                </Col>
                <Col span={3}>

                </Col>
                <Col span={3}>

                </Col>
                <Col span={3}>

                </Col>
                <Col span={3}>

                </Col>
                <Col span={3}>

                </Col>
                <Col span={3}>

                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Amount", "金额", 1000000000, 0, 1, 10)}
                </Col>
                <Col span={1}>
                    <a style={{ lineHeight: "32px" }} onClick={this.props.Delete}>删除</a>
                </Col>
            </Row>
            <Row gutter={6} style={{ padding: "8px 8px", borderBottom: "1px solid #e8e8e8" }}>
                <Col span={24}>
                    {this.RenderRemark()}
                </Col>
            </Row>
        </div>)
    }

    RenderRemark() {
        return <TextArea rows={2}
            placeholder={"附加费备注"}
            onChange={this.OnChangeRemark.bind(this)}
            maxLength={200}
            value={this.state.Remark} />
    }

    OnChangeRemark(e) {
        this.props.Data.Remark = e.target.value;
        this.setState({ Remark: e.target.value })
    }

    CheckBoxChange(value) {
        const ids = value.length === 0 ? "" : value.join(",");
        this.props.Data.ProcessItemIds = ids;
        this.setState({ ProcessItemIds: ids })
    }

    RenderCheckBoxList() {
        let value = this.state.ProcessItemIds || "";
        if (!Common.IsNullOrEmpty(value)) value = value.split(",");
        else value = [];

        return <Checkbox.Group value={value} onChange={this.CheckBoxChange.bind(this)} options={this.state.ProcessItems}></Checkbox.Group>
    }

    GetCheckBox(data) {
        return { label: data.Name, value: data.Id };
    }

    Render1() {
        return (<div>
            <Row gutter={6} style={{ padding: "8px 8px" }}>
                <Col span={2}>
                    {this.RenderInputNumber("DisplayIndex", "", 99, 1, 1, 2)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Height", "宽度(mm)", 9999, 1, 0, 4)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Width", "高度(mm)", 9999, 1, 0, 4)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Thickness", "厚度(mm)", 9999, 0, 1, 4)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Number", "数量(件)", 9999, 1, 0, 4)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Area", "面积(㎡)", 10000, 0.1000, 0.0001, 10)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Price", "单价(元/㎡)", 1000000000, 0, 1, 6)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Amount", "金额", 1000000000, 0, 1, 10)}
                </Col>
                <Col span={1}>
                    <a style={{ lineHeight: "32px" }} onClick={this.props.Delete}>删除</a>
                </Col>
            </Row>
            <Row gutter={6} style={{ padding: "8px 8px", borderBottom: "1px solid #e8e8e8" }}>
                <Col span={24}>
                    {this.RenderCheckBoxList()}
                </Col>
            </Row>
        </div>)
    }
}