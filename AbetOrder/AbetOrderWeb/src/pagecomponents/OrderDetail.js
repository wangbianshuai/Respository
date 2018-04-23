import React from "react"
import Index from "./Index"
import { Alert, Row, Col, Button, Card, Checkbox } from "antd"
import styles from "../styles/OrderDetail.css"
import OrderDetailItem from "./OrderDetailItem"
import Button2 from "../controls/Button2"
import * as Common from "../utils/Common"
import OrderRemarkItem from "./OrderRemarkItem"

export default class OrderDetail extends Index {
    constructor(props) {
        super(props)

        this.state = { IsEdit: !props.Page.IsEdit, Remarks: [], Details: [], ProcessItems: [], TotalAmount1: 0, TotalAmount2: 0, TotalArea: 0, TotalNumber: 0, RemarkItemOptions: [] }
    }

    componentWillMount() {
        this.GetDataSource({}, "GetProcessItemList", "ProcessItems");
        this.GetDataSource({}, "GetRemarkItemList", "RemarkItemOptions", (list) => {
            this.setState({ RemarkItemOptions: this.GetCheckBoxItems(list) });
        });

        const { EntityData } = this.Page.props.PageConfig
        if (EntityData) this.SetValue(EntityData);
    }

    SetValue(value) {
        this.EntityData = value;

        let details = value.Details || [];
        let data = {};
        if (Common.IsArray(details)) {
            details.forEach(d => d.Id = Common.CreateGuid());
            details = details.sort((a, b) => a.DisplayIndex > b.DisplayIndex ? 1 : -1);

            data = this.GetTotalAmount(details);
        }

        data.Details = details;
        data.RemarkItemIds = value.RemarkItemIds;
        data.IsEdit = value.OrderStatus === 0;
        this.setState(data);
    }

    GetValue() {
        const noNullNames = ["Width", "Height", "Number", "Price", "Amount"];
        let msg = "", d = null;
        for (let i = 0; i < this.state.Details.length; i++) {
            d = this.state.Details[i];
            if (d.DetailType === 1) msg = this.JudgeNullable(d, noNullNames);
            else if (!(d.Amount > 0)) msg = "金额应大于零！";

            if (!Common.IsNullOrEmpty(msg)) break;
        }

        if (!Common.IsNullOrEmpty(msg)) { this.Page.ShowMessage(msg); return false; }

        const details = this.state.Details.map((m, i) => {
            m.DisplayIndex = i + 1;
            if (m.Id) delete m.Id
            return m
        });

        return { Details: details, RemarkItemIds: this.state.RemarkItemIds };
    }

    JudgeNullable(data, noNullNames) {
        let n = "";
        for (let i = 0; i < noNullNames.length; i++) {
            n = noNullNames[i];
            if (!(data[n] > 0)) return "订单明细宽度、高度、数量、单价、金额皆应大于零！"
        }

        return "";
    }

    GetCheckBoxItems(list) {
        return list.map(m => { return { label: m.Name, value: m.Id } });
    }

    RenderTotalAmount() {
        const a1 = Common.ToCurrency(this.state.TotalAmount1);
        const a2 = Common.ToCurrency(this.state.TotalAmount2);
        const a3 = Common.ToCurrency(this.state.TotalAmount1 + this.state.TotalAmount2);

        return <div className={styles.DivTotal}>合计，明细金额：<span>{a1}</span>，附加费：<span>{a2}</span>，总金额：<span>{a3}</span>，面积：<span>{this.state.TotalArea}</span>，数量：<span>{this.state.TotalNumber}</span></div>
    }

    SetTotalAmount() {
        this.setState(this.GetTotalAmount(this.state.Details))
    }

    GetTotalAmount(details) {
        let totalAmount1 = 0, totalAmount2 = 0, totalArea = 0, totalNumber = 0;

        details.forEach(d => {
            if (d.DetailType === 1 && d.Amount > 0) totalAmount1 += d.Amount;
            else if (d.DetailType === 2 && d.Amount > 0) totalAmount2 += d.Amount;

            if (d.Area > 0) totalArea += d.Area * 10000;
            if (d.Number > 0) totalNumber += d.Number;
        });

        totalArea = totalArea / 10000;

        if (this.props.Page.SetAmountExtraCharge && this.state.IsEdit) this.props.Page.SetAmountExtraCharge(totalAmount1, totalAmount2);

        return { TotalAmount1: totalAmount1, TotalAmount2: totalAmount2, TotalArea: totalArea, TotalNumber: totalNumber };
    }

    GetAddButton(name, text) {
        const p = {
            Name: name, Text: text, Icon: "plus",
            ButtonType: "dashed",
            Style: { width: '100%', marginTop: 16, marginBottom: 8 },
            Type: "Button"
        };

        return (<Button2 Property={p} Page={this.props.Page} View={this.props.Property} ClickAction={this.AddDetail.bind(this, text)} />)
    }

    AddDetail(text) {
        let details = this.state.Details;
        const detailType = text === "添加明细" ? 1 : 2;
        let price = 0;

        for (var i = details.length - 1; i >= 0; i--) {
            if (details[i].Price > 0) { price = details[i].Price; break; }
        }

        let detail = { DetailType: detailType, OrderDetailId: Common.CreateGuid(), DisplayIndex: details.length + 1 }
        if (detailType === 1 && price > 0) detail.Price = price;
        if (detailType === 1) { detail.Number = 1; detail.Thickness = 20; }

        details.push(detail);

        this.SetDisplayIndex();
    }

    Delete(d) {
        const details = this.state.Details.filter(f => f.OrderDetailId !== d.OrderDetailId);

        this.SetDetails(details);

        this.setState(this.GetTotalAmount(details))
    }

    SetDetails(details) {
        details = details.map((d, i) => {
            if (d.DisplayIndex === i + 1 && d.Id !== undefined) return d;
            else d.DisplayIndex = i + 1; d.Id = Common.CreateGuid(); return d;
        });

        this.setState({ Details: details });
    }

    SetDisplayIndex() {
        let details = this.state.Details;
        details.forEach(a => a.DisplayIndex = a.DisplayIndex * (a.DetailType === 1 ? 1 : 100000));
        details = details.sort((a, b) => a.DisplayIndex > b.DisplayIndex ? 1 : -1);

        this.SetDetails(details);
    }

    CheckBoxChange(value) {
        const ids = value.length === 0 ? "" : value.join(",");
        this.setState({ RemarkItemIds: ids })
    }

    RenderRemarkCheckBoxList() {
        let value = this.state.RemarkItemIds || "";
        if (!Common.IsNullOrEmpty(value)) value = value.split(",");
        else value = [];

        if (this.state.IsEdit) {
            return <Checkbox.Group value={value}
                className={styles.DivRemark}
                onChange={this.CheckBoxChange.bind(this)} options={this.state.RemarkItemOptions}></Checkbox.Group>
        }
        else {
            let options = [];
            const ids = this.state.RemarkItemIds || "";
            this.state.RemarkItemOptions.forEach(r => {
                if (ids.indexOf(r.value) >= 0) options.push(r);
            });

            return <Checkbox.Group value={value}
                className={styles.DivRemark}
                options={options}></Checkbox.Group>
        }
    }

    ExcelImport() {

    }

    ExcelExport() {

    }

    SelectRemarkList() {

    }

    SetRemarkDisplayIndex() {

    }

    RenderOrderRemarkList() {
        return <div>
            {this.state.IsEdit ?
                <Row gutter={6} style={{ padding: "8px 8px" }}>
                    <Col span={24}>
                        <Button onClick={this.SetRemarkDisplayIndex.bind(this)}>重新排序</Button>
                        <Button onClick={this.SelectRemarkList.bind(this)} style={{ marginLeft: "20px" }}>常用备注</Button>
                    </Col>
                </Row> : null}
            <Row gutter={6} className={styles.RowHeader}>
                <Col span={2}>
                    序号
            </Col>
                <Col span={19}>
                    备注
            </Col>
                {this.state.IsEdit ?
                    <Col span={3}>
                        操作
            </Col> : null}
            </Row>
            {this.state.Remarks.map(m => <OrderRemarkItem Data={m}
                key={m.Id}
                IsEdit={this.state.IsEdit}
                Delete={this.Delete.bind(this, m)} />)}
            {this.state.IsEdit ?
                <Row gutter={16}>
                    <Col span={24}>
                        {this.GetAddButton("AddRemark", "添加备注")}
                    </Col>
                </Row> : null}
        </div>
    }

    render() {
        return (
            <div>
                <Alert message={this.RenderTotalAmount()} type="info" showIcon={true} />
                {this.state.IsEdit ?
                    <Row gutter={6} style={{ padding: "8px 8px" }}>
                        <Col span={24}>
                            <Button onClick={this.SetDisplayIndex.bind(this)}>重新排序</Button>
                            <Button onClick={this.ExcelImport.bind(this)} style={{ marginLeft: "20px" }}>Excel导入</Button>
                            <Button onClick={this.ExcelExport.bind(this)} style={{ marginLeft: "20px" }}>Excel导出</Button>
                        </Col>
                    </Row> : null}
                <Row gutter={6} className={styles.RowHeader}>
                    <Col span={2}>
                        序号
                    </Col>
                    <Col span={2}>
                        高度(mm)
                    </Col>
                    <Col span={2}>
                        宽度(mm)
                    </Col>
                    <Col span={3}>
                        厚度(mm)
                    </Col>
                    <Col span={3}>
                        数量(件)
                    </Col>
                    <Col span={3}>
                        面积(㎡)
                    </Col>
                    <Col span={3}>
                        单价(元/㎡)
                    </Col>
                    <Col span={3}>
                        金额
                    </Col>
                    {this.state.IsEdit ?
                        <Col span={3}>
                            操作
                    </Col> : null}
                </Row>
                {this.state.Details.map(m => <OrderDetailItem Data={m}
                    key={m.Id}
                    IsEdit={this.state.IsEdit}
                    SetTotalAmount={this.SetTotalAmount.bind(this)}
                    ProcessItems={this.state.ProcessItems}
                    Delete={this.Delete.bind(this, m)} />)}
                {this.state.IsEdit ?
                    <Row gutter={16}>
                        <Col span={12}>
                            {this.GetAddButton("AddDetail1", "添加明细")}
                        </Col>
                        <Col span={12}>
                            {this.GetAddButton("AddDetail2", "添加附加费")}
                        </Col>
                    </Row> : null}
                <Card title="备注" bordered={false}>{this.RenderOrderRemarkList()}</Card>
            </div>
        )
    }
}