import React from "react"
import Index from "./Index"
import { Input, InputNumber, Row, Col, Divider } from "antd";
import * as Common from "../utils/Common";
const { TextArea } = Input;

export default class OrderRemarkItem extends Index {
    constructor(props) {
        super(props)

        this.state = Object.assign({}, props.Data);
    }

    RenderInputNumber(name, placeholder, max, min, step, maxLength, readOnly) {
        let value = this.state[name];
        value = value === undefined ? "" : value;

        if (readOnly) {
            return <Input placeholder={placeholder}
                readOnly={readOnly}
                value={value} />
        }
        else {
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
    }

    InputNumberChange(name, value) {
        const data = {};
        data[name] = value;
        this.props.Data[name] = data[name];
        this.setState(data);
    }

    render() {
        return (<div>
            <Row gutter={6} style={{ padding: "8px 8px" }}>
                <Col span={2}>
                    {this.RenderInputNumber("DisplayIndex", "", 99, 1, 1, 2, !this.props.IsEdit)}
                </Col>
                <Col span={19}>
                    {this.RenderRemark()}
                </Col>
                {this.props.IsEdit ?
                    <Col span={3}>
                        <a style={{ lineHeight: "32px" }} onClick={this.SetStyle.bind(this)}>样式</a>
                        <Divider type="vertical" />
                        <a style={{ lineHeight: "32px" }} onClick={this.props.Delete}>删除</a>
                    </Col> : null}
            </Row>
        </div>)
    }

    SetStyle() {

    }

    RenderRemark() {
        return <TextArea rows={2}
            placeholder={"备注"}
            onChange={this.OnChangeRemark.bind(this)}
            maxLength={200}
            readOnly={!this.props.IsEdit}
            value={this.state.Remark} />
    }

    OnChangeRemark(e) {
        this.props.Data.Remark = e.target.value;
        this.setState({ Remark: e.target.value })
    }
}