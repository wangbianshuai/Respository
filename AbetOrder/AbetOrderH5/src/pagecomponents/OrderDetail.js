import React from "react"
import Index from "./Index"
import { Alert, Row, Col, Button, Card, Checkbox } from "antd"
import styles from "../styles/OrderDetail.css"
import OrderDetailItem from "./OrderDetailItem"
import Button2 from "../controls/Button2"
import * as Common from "../utils/Common"
import OrderRemarkItem from "./OrderRemarkItem"
import ModalDialog from "../components/ModalDialog";
import Upload2 from "../controls/Upload2"

export default class OrderDetail extends Index {
    constructor(props) {
        super(props)

        this.state = {
            IsEdit: !props.Page.IsEdit, Remarks: [], Details: [],
            ExcelImportDisabled: false, ExcelExportDisabled: false,
            ProcessItems: [], RemarkItemNames: [], TotalAmount1: 0, TotalAmount2: 0, TotalArea: 0,
            TotalNumber: 0, RemarkItemOptions: []
        }
    }

    componentWillMount() {
        this.SelectRemarkProperty = {
            Title: "常用备注", Width: 700, Visible: false,
            GetComponent: () => this.RenderRemarkCheckBoxList(),
            OnOk: this.SetSelectRemark.bind(this)
        };

        this.InitExcelImport();
        this.InitColumns();

        this.GetDataSource({}, "GetProcessItemList", "ProcessItems");
        this.GetDataSource({}, "GetRemarkItemList", "RemarkItemOptions", (list) => {
            this.setState({ RemarkItemOptions: this.GetCheckBoxItems(list) });
        });

        const { EntityData } = this.Page.props.PageConfig
        if (EntityData) this.SetValue(EntityData);
    }

    InitExcelImport() {
        this.UploadProperty = {
            Id: Common.CreateGuid(),
            Name: "ExcelImport",
            UploadUrl: "?EntityName=OrderExcelImport&ft=Excel",
            IsEdit: false,
            UploadText: "Excel导入",
            IsInitState: true,
            FileSize: 1024 * 1024, FileSizeText: "1M"
        };

        this.UploadProperty.Accept = ".xls,.xlsx";

        this.UploadProperty.SetUploadResponse = this.SetExcelImportResponse.bind(this);
    }

    SetExcelImportResponse(response) {
        this.SetValue(response);
    }

    InitColumns() {
        this.Columns = {
            DisplayIndex: "序号",
            Height: "高度",
            Width: "宽度",
            Thickness: "厚度",
            Number: "数量",
            Area: "面积",
            Price: "单价",
            Amount: "金额",
            Remark: "备注",
            FontFamily: "字体",
            FontSize: "字体大小",
            FontColor: "字体颜色",
            IsBold: "是否加粗",
            IsUnderline: "是否下划线"
        }
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

        let remarks = value.Remarks || [];
        if (Common.IsArray(remarks)) {
            remarks.forEach(d => d.RemarkId = Common.CreateGuid());
            remarks = remarks.sort((a, b) => a.DisplayIndex > b.DisplayIndex ? 1 : -1);
        }

        data.Remarks = remarks;

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

        const remarks = this.state.Remarks.map((m, i) => {
            m.DisplayIndex = i + 1;
            if (m.RemarkId) delete m.RemarkId
            return m
        });

        return { Details: details, Remarks: remarks };
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
        return list.map(m => { return { label: m.Name, value: m.Name } });
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
        if (text === "添加备注") return this.AddRemark();
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

    AddRemark() {
        let remarks = this.state.Remarks;
        let remark = { Id: Common.CreateGuid(), DisplayIndex: remarks.length + 1 }
        remarks.push(remark);

        this.SetRemarkDisplayIndex();
    }

    SetRemarkDisplayIndex() {
        let remarks = this.state.Remarks;
        remarks = remarks.sort((a, b) => a.DisplayIndex > b.DisplayIndex ? 1 : -1);

        this.SetRemarks(remarks);
    }

    SetRemarks(remarks) {
        remarks = remarks.map((d, i) => {
            if (d.DisplayIndex === i + 1 && d.RemarkId !== undefined) return d;
            else d.DisplayIndex = i + 1; d.RemarkId = Common.CreateGuid(); return d;
        });

        this.setState({ Remarks: remarks });
    }

    DeleteRemark(d) {
        const remarks = this.state.Remarks.filter(f => f.Id !== d.Id);
        this.SetRemarks(remarks);
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
        this.setState({ RemarkItemNames: value })
    }

    SetSelectRemark(e, p, dailog) {
        let remarks = this.state.Remarks
        remarks = remarks.concat(this.state.RemarkItemNames.map((m, i) => {
            return { DisplayIndex: remarks.length + i + 1, Remark: m, RemarkId: Common.CreateGuid(), Id: Common.CreateGuid() }
        }))
        this.setState({ Remarks: remarks.map(m => m) });
        dailog.Cancel();
    }

    RenderRemarkCheckBoxList() {
        return <Checkbox.Group value={this.state.RemarkItemNames}
            className={styles.DivRemark}
            onChange={this.CheckBoxChange.bind(this)} options={this.state.RemarkItemOptions}></Checkbox.Group>
    }

    RenderSelectRemarkDialog() {
        return <ModalDialog Property={this.SelectRemarkProperty} RemarkItemNames={this.state.RemarkItemNames} Page={this.props.Page} />
    }

    ExcelExport() {
        this.Page.ShowConfirm("确认Excel导出吗？", () => this.ExcelExportDetail());
    }

    ExcelExportDetail() {
        const action = this.Page.GetAction("ExcelExportDetail");
        if (!action) return;

        let details = [];
        this.GetExportDetailList(details, this.state.Details)
        this.GetExportDetailList(details, this.state.Remarks)

        const data = {};
        data.Order = { Details: details, Columns: this.Columns };

        this.setState({ ExcelExportDisabled: true });

        const property = { Id: Common.CreateGuid() };
        property.ActionType = "Page";
        property.ActionName = "Request"

        property.SetResponse = (res) => {
            if (res && res.FileName) {
                this.setState({ ExcelExportDisabled: false });

                let url = Common.DataApiUrl.replace("api/", "download.aspx")
                url += "?fn=" + res.FileName;

                window.open(url, "_self")
            }
        };

        property.payload = data;
        this.Page.InvokeAction(property, action);
    }

    GetExportDetailList(details, list) {
        let d = null;
        list.forEach((m, i) => {
            d = Object.assign({}, m);
            d.DisplayIndex = i + 1;
            d.IsBold = Common.GetIntValue(d.IsBold) === 1 ? "是" : "否";
            d.IsUnderline = Common.GetIntValue(d.IsUnderline) === 1 ? "是" : "否";
            details.push(d);
        });
    }

    SelectRemarkList() {
        this.SelectRemarkProperty.SetVisible(true);
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
                key={m.RemarkId}
                IsEdit={this.state.IsEdit}
                Delete={this.DeleteRemark.bind(this, m)} />)}
            {this.state.IsEdit ?
                <Row gutter={16}>
                    <Col span={24}>
                        {this.GetAddButton("AddRemark", "添加备注")}
                    </Col>
                </Row> : null}
            {this.state.IsEdit ? this.RenderSelectRemarkDialog() : null}
        </div>
    }

    RenderUpload() {
        const props = { Page: this.props.Page, Property: this.UploadProperty, View: {} }
        return <Upload2 {...props} key={this.UploadProperty.Id} />
    }

    render() {
        return (
            <div>
                <Alert message={this.RenderTotalAmount()} type="info" showIcon={true} />
                {this.state.IsEdit ?
                    <Row gutter={6} style={{ padding: "8px 8px" }}>
                        <Col span={24}>
                            <div style={{ float: "left" }}><Button onClick={this.SetDisplayIndex.bind(this)}>重新排序</Button></div>
                            <div style={{ marginLeft: "20px", float: "left" }}>{this.RenderUpload()}</div>
                            <div style={{ marginLeft: "20px", float: "left" }}><Button onClick={this.ExcelExport.bind(this)} disabled={this.state.ExcelExportDisabled}>Excel导出</Button></div>
                        </Col>
                    </Row> :
                    <Row gutter={6} style={{ padding: "8px 8px" }}>
                        <Col span={24}>
                            <Button onClick={this.ExcelExport.bind(this)} disabled={this.state.ExcelExportDisabled} >Excel导出</Button>
                        </Col>
                    </Row>}
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