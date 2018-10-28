import React from "react"
import Index from "./Index"
import { Row, Col, Button } from "antd"
import styles from "../styles/OrderDetail.css"
import OrderImageItem from "./OrderImageItem"
import Button2 from "../controls/Button2"
import * as Common from "../utils/Common"

export default class OrderImage extends Index {
    constructor(props) {
        super(props)

        this.state = { Images: [], IsEdit: !props.Page.IsEdit }
    }

    componentWillMount() {
        const { EntityData } = this.Page.props.PageConfig
        if (EntityData) this.SetValue(EntityData);
    }

    SetValue(value) {
        this.EntityData = value;
        let images = value.Images;

        if (Common.IsArray(images)) {
            images.forEach(d => d.ImageId = Common.CreateGuid());
            images = images.sort((a, b) => a.DisplayIndex > b.DisplayIndex ? 1 : -1);
        }
        this.setState({ Images: images, IsEdit: value.OrderStatus === 0 });
    }

    GetValue() {
        let msg = "", d = null;
        for (let i = 0; i < this.state.Images.length; i++) {
            d = this.state.Images[i];
            if (Common.IsNullOrEmpty(d.ImageUrl)) msg = "订单附件新增附件，请先上传附件！";
            if (!Common.IsNullOrEmpty(msg)) break;
        }

        if (!Common.IsNullOrEmpty(msg)) { this.Page.ShowMessage(msg); return false; }

        const images = this.state.Images.map((m, i) => {
            m.DisplayIndex = i + 1;
            if (Common.IsNullOrEmpty(m.Name)) m.Name = (m.FileType === 1 ? "订单附件" : "加工单附件") + m.DisplayIndex;
            if (m.ImageId) delete m.ImageId
            return m
        });

        return { Images: images };
    }

    GetAddButton(name, text) {
        const p = {
            Name: name, Text: text, Icon: "plus",
            ButtonType: "dashed",
            Style: { width: '100%', marginTop: 16, marginBottom: 8 },
            Type: "Button"
        };

        return (<Button2 Property={p} Page={this.props.Page} View={this.props.Property} ClickAction={this.AddImage.bind(this, text)} />)
    }

    AddImage(text) {
        let images = this.state.Images;
        const image = { Id: Common.CreateGuid(), FileType: text === "添加订单附件" ? 1 : 2, DisplayIndex: images.length + 1 }

        images.push(image);

        this.SetDisplayIndex();
    }

    Delete(d) {
        const images = this.state.Images.filter(f => f.Id !== d.Id);

        this.SetDetails(images);
    }

    SetDetails(images) {
        images = images.map((d, i) => {
            if (d.DisplayIndex === i + 1 && d.ImageId !== undefined) return d;
            else d.DisplayIndex = i + 1; d.ImageId = Common.CreateGuid(); return d;
        });

        this.setState({ Images: images });
    }

    SetDisplayIndex() {
        let images = this.state.Images;
        images = images.sort((a, b) => a.DisplayIndex > b.DisplayIndex ? 1 : -1);

        this.SetDetails(images);
    }

    render() {
        return (
            <div>
                {this.state.IsEdit ?
                    <Row gutter={6} style={{ padding: "8px 8px" }}>
                        <Col span={24}>
                            <Button onClick={this.SetDisplayIndex.bind(this)}>重新排序</Button>
                        </Col>
                    </Row> : null
                }
                <Row gutter={6} className={styles.RowHeader}>
                    <Col span={2}>
                        序号
                    </Col>
                    <Col span={4}>
                        名称
                    </Col>
                    <Col span={2}>
                        类型
                    </Col>
                    <Col span={8}>
                        路径
                    </Col>
                    {this.state.IsEdit ?
                        <Col span={6}>
                            上传
                    </Col> : null}
                    {this.state.IsEdit ?
                        <Col span={2}>
                            操作
                    </Col> : null}
                </Row>
                {this.state.Images.map(m => <OrderImageItem Page={this.props.Page} IsEdit={this.state.IsEdit} View={this.props.Property} Data={m} key={m.ImageId} Delete={this.Delete.bind(this, m)} />)}
                {this.state.IsEdit ?
                    <Row gutter={16}>
                        <Col span={12}>
                            {this.GetAddButton("AddDetailImage", "添加订单附件")}
                        </Col>
                        <Col span={12}>
                            {this.GetAddButton("AddDetailAttach", "添加加工单附件")}
                        </Col>
                    </Row> : null
                }
            </div>
        )
    }
}