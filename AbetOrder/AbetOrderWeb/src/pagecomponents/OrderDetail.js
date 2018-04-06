import React from "react"
import Index from "./Index"
import { Alert, Row, Col } from "antd"
import styles from "../styles/OrderDetail.css"
import OrderDetailItem from "./OrderDetailItem"
import Button2 from "../controls/Button2"
import * as Common from "../utils/Common"

export default class OrderDetail extends Index {
    constructor(props) {
        super(props)

        this.state = { Details: [], ProcessItems: [] }
    }

    componentWillMount() {
        this.GetDataSource("GetProcessItemList", "ProcessItems");
    }


    RenderTotalAmount() {
        return <div>明细总金额：234345，附加费总金额：2342554，总计：234354452345</div>
    }

    GetAddButton(text) {
        const p = {
            Name: "ComplexAdd", Text: text, Icon: "plus",
            ButtonType: "dashed",
            Style: { width: '100%', marginTop: 16, marginBottom: 8 },
            Type: "Button"
        };

        return (<Button2 Property={p} Page={this.props.Page} View={this.props.Property} ClickAction={this.AddDetail.bind(this, text)} />)
    }

    AddDetail(text) {
        const detail = { DetailType: text === "添加明细" ? 1 : 2, OrderDetailId: Common.CreateGuid() }
        let details = this.state.Details;

        const list = details.filter(f => f.DetailType === detail.DetailType);
        const max = Common.ArrayMax(list, "Index");
        detail.Index = max === null ? (detail.DetailType === 1 ? 1 : 10001) : max.Index + 1;

        details.push(detail);

        details = details.sort((a, b) => a.Index > b.Index ? 1 : -1);
        details = details.map((d, i) => { d.DisplayIndex = i + 1; d.Id = Common.CreateGuid(); return d });

        this.setState({ Details: details });
    }

    Delete(d) {
        let details = this.state.Details.filter(f => f.OrderDetailId !== d.OrderDetailId);

        details = details.map((d, i) => { d.DisplayIndex = i + 1; d.Id = Common.CreateGuid(); return d });

        this.setState({ Details: details });
    }

    render() {
        return (
            <div>
                <Alert message={this.RenderTotalAmount()} type="info" showIcon={true} />
                <Row gutter={6} className={styles.RowHeader}>
                    <Col span={2}>
                        序号
                    </Col>
                    <Col span={3}>
                        宽度
                    </Col>
                    <Col span={3}>
                        高度
                    </Col>
                    <Col span={3}>
                        厚度
                    </Col>
                    <Col span={3}>
                        面积
                    </Col>
                    <Col span={3}>
                        数量
                    </Col>
                    <Col span={3}>
                        单价
                    </Col>
                    <Col span={3}>
                        金额
                    </Col>
                    <Col span={1}>
                        操作
                    </Col>
                </Row>
                {this.state.Details.map(m => <OrderDetailItem Data={m} key={m.Id} ProcessItems={this.state.ProcessItems} Delete={this.Delete.bind(this, m)} />)}
                <Row gutter={16}>
                    <Col span={12}>
                        {this.GetAddButton("添加明细")}
                    </Col>
                    <Col span={12}>
                        {this.GetAddButton("添加附加费")}
                    </Col>
                </Row>
            </div>
        )
    }
}