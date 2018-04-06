import React from "react"
import Index from "./Index"
import { Input, InputNumber, Row, Col, Checkbox } from "antd";
import * as Common from "../utils/Common";
const { TextArea } = Input;

export default class OrderDetailItem extends Index {
    constructor(props) {
        super(props)

        this.state = { Data: props.Data, ProcessItems: this.GetCheckBoxItems(props.ProcessItems) }
    }

    GetCheckBoxItems(list) {
        return list.map(m => { return { label: m.Name, value: m.Id } });
    }

    RenderInputNumber(name, placeholder, max, min, step, maxLength) {
        let value = this.state.Data[name];
        value = value === undefined ? "" : value;

        return <InputNumber placeholder={placeholder}
            style={{ width: "100%" }}
            onChange={this.InputNumberChange.bind(this, name)}
            maxLength={maxLength || 10}
            max={max}
            min={min}
            step={step}
            value={value} />
    }

    InputNumberChange(name, e) {

    }

    render() {
        return this.state.Data.DetailType === 1 ? this.Render1() : this.Render2()
    }

    Render2() {
        return (<div>
            <Row gutter={6} style={{ padding: "8px 8px" }}>
                <Col span={2}>
                    {this.RenderInputNumber("DisplayIndex", "", 99999, 1, 1, 5)}
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
                    {this.RenderInputNumber("Amount", "金额", 1000000000, 0.01, 0.01, 10)}
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
            value={this.state.Data.Remark} />
    }

    OnChangeRemark() {

    }

    RenderCheckBoxList() {
        let value = this.state.Data.ProcessItemIds || "";
        if (!Common.IsNullOrEmpty(value)) value = value.split(",");
        else value = [];

        return <Checkbox.Group value={value} options={this.state.ProcessItems}></Checkbox.Group>
    }

    GetCheckBox(data) {
        return { label: data.Name, value: data.Id };
    }

    Render1() {
        return (<div>
            <Row gutter={6} style={{ padding: "8px 8px" }}>
                <Col span={2}>
                    {this.RenderInputNumber("DisplayIndex", "", 99999, 1, 1, 5)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Width", "宽度", 99999, 1, 1, 5)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Height", "高度", 99999, 1, 1, 5)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Thickness", "厚度", 99999, 1, 1, 5)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Area", "面积", 1000000000, 0.0001, 0.0001, 10)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Price", "单价", 1000000000, 0.01, 0.01, 10)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Number", "数量", 99999, 1, 1, 5)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Amount", "金额", 1000000000, 0.01, 0.01, 10)}
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