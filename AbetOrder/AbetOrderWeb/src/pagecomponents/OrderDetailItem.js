import React from "react"
import Index from "./Index"
import { Input, InputNumber, Row, Col, Checkbox, Divider } from "antd";
import * as Common from "../utils/Common";
import ModalDialog from "../components/ModalDialog";
const { TextArea } = Input;

export default class OrderDetailItem extends Index {
    constructor(props) {
        super(props)

        this.state = Object.assign({}, props.Data, { ProcessItemNames: [], ProcessItems: this.GetCheckBoxItems(props.ProcessItems) });
    }

    componentWillMount() {
        this.SelectRemarkProperty = {
            Title: "常用加工选择备注", Width: 700, Visible: false,
            GetComponent: () => this.GetCheckBoxRemarkItems(),
            OnOk: this.SetSelectRemark.bind(this)
        };

        const view = { IsVisible: true, Properties: this.GetStyleEditProperties() }


        this.StyleEditView = this.InitSetView(view)

        this.RemarkStyleProperty = {
            Title: "设置备注样式", Visible: false, IsOk: false,
            Component: this.GetStyleEdit()
        };
    }

    GetStyleEdit() {
        return this.RenderView(this.StyleEditView);
    }

    GetStyleEditProperties() {
        return [{ Label: "字体", Name: "FontFamily", DataType: "string", MaxLength: 50 },
        { Label: "大小", Name: "FontSize", DataType: "string", Type: "Select", DataSource: this.GetFontSizeDataSource() },
        { Label: "颜色", Name: "FontColor", DataType: "string", MaxLength: 20 },
        { Label: "加粗", Name: "IsBold", Type: "CheckBox", DataType: "byte", },
        { Label: "下划线", Name: "IsUnderline", Type: "CheckBox", DataType: "byte" }]
    }

    GetFontSizeDataSource() {
        return [{ Value: "12px", Text: "12px" }, { Value: "14px", Text: "14px" },
        { Value: "16px", Text: "16px" }, { Value: "18px", Text: "18px" },
        { Value: "20px", Text: "20px" }, { Value: "22px", Text: "22px" },
        { Value: "24px", Text: "24px" }, { Value: "26px", Text: "26px" },
        { Value: "28px", Text: "28px" }, { Value: "30px", Text: "30px" },
        { Value: "32px", Text: "32px" }, { Value: "34px", Text: "34px" }, { Value: "36px", Text: "36px" }]
    }

    GetCheckBoxItems(list) {
        return list.map(m => { return { label: m.Name, value: m.Name } });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.ProcessItems !== this.props.ProcessItems) {
            this.setState({ ProcessItems: this.GetCheckBoxItems(nextProps.ProcessItems) })
        }
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
                    {this.RenderInputNumber("DisplayIndex", "", 99, 1, 1, 2, !this.props.IsEdit)}
                </Col>
                <Col span={2}>

                </Col>
                <Col span={2}>

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
                    {this.RenderInputNumber("Amount", "金额", 1000000000, 0, 1, 10, !this.props.IsEdit)}
                </Col>
                {this.props.IsEdit ?
                    <Col span={3}>
                        <a style={{ lineHeight: "32px" }} onClick={this.props.Delete}>删除</a>
                    </Col> : null}
            </Row>
            <Row gutter={6} style={{ padding: "8px 8px", borderBottom: "1px solid #e8e8e8" }}>
                <Col span={21}>
                    {this.RenderRemark()}
                </Col>
                <Col span={3}>
                    <a style={{ lineHeight: "32px" }} onClick={this.SetStyle.bind(this)}>样式</a>
                </Col>
            </Row>
            {this.RenderRemarkStyleDialog()}
        </div>)
    }

    RenderRemarkStyleDialog() {
        return <ModalDialog Property={this.RemarkStyleProperty} Page={this.props.Page} />
    }

    RenderSelectRemarkDialog() {
        return <ModalDialog Property={this.SelectRemarkProperty} ProcessItemNames={this.state.ProcessItemNames} Page={this.props.Page} />
    }

    SelectRemarkItem() {
        this.SelectRemarkProperty.SetVisible(true);
    }

    SetSelectRemark(e, p, dailog) {
        let remark = this.state.Remark || "";
        remark += this.state.ProcessItemNames.join("、");
        this.setState({ Remark: remark });
        dailog.Cancel();
    }

    SetStyle() {
        this.RemarkStyleProperty.SetVisible(true);
    }

    CheckBoxChange(value) {
        this.setState({ ProcessItemNames: value })
    }

    GetCheckBoxRemarkItems() {
        return <Checkbox.Group value={this.state.ProcessItemNames}
            onChange={this.CheckBoxChange.bind(this)}
            options={this.state.ProcessItems}></Checkbox.Group>
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

    Render1() {
        return (<div>
            <Row gutter={6} style={{ padding: "8px 8px" }}>
                <Col span={2}>
                    {this.RenderInputNumber("DisplayIndex", "", 99, 1, 1, 2, !this.props.IsEdit)}
                </Col>
                <Col span={2}>
                    {this.RenderInputNumber("Height", "高度(mm)", 9999, 1, 0, 4, !this.props.IsEdit)}
                </Col>
                <Col span={2}>
                    {this.RenderInputNumber("Width", "宽度(mm)", 9999, 1, 0, 4, !this.props.IsEdit)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Thickness", "厚度(mm)", 9999, 0, 1, 4, !this.props.IsEdit)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Number", "数量(件)", 9999, 1, 0, 4, !this.props.IsEdit)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Area", "面积(㎡)", 10000, 0.1000, 0.0001, 10, !this.props.IsEdit)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Price", "单价(元/㎡)", 1000000000, 0, 1, 6, !this.props.IsEdit)}
                </Col>
                <Col span={3}>
                    {this.RenderInputNumber("Amount", "金额", 1000000000, 0, 1, 10, !this.props.IsEdit)}
                </Col>
                {this.props.IsEdit ?
                    <Col span={3}>
                        <a style={{ lineHeight: "32px" }} onClick={this.props.Delete}>删除</a>
                    </Col> : null}
            </Row>
            <Row gutter={6} style={{ padding: "8px 8px", borderBottom: "1px solid #e8e8e8" }}>
                <Col span={21}>
                    {this.RenderRemark()}
                </Col>
                <Col span={3}>
                    <a style={{ lineHeight: "32px" }} onClick={this.SelectRemarkItem.bind(this)}>常用备注</a>
                    <Divider type="vertical" />
                    <a style={{ lineHeight: "32px" }} onClick={this.SetStyle.bind(this)}>样式</a>
                </Col>
            </Row>
            {this.RenderSelectRemarkDialog()}
            {this.RenderRemarkStyleDialog()}
        </div>)
    }
}