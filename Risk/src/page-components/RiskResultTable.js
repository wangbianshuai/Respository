import React, { Component } from "react"
import { Table } from "antd"
import styles from "../styles/View.css"

export default class RiskResultTable extends Component {
    constructor(props) {
        super(props)

        this.Property = props.Property;
        this.Property.SetValue = this.SetValue.bind(this);
        this.Property.SetVisible = (v) => this.setState({ IsVisible: v })

        this.state = { DataList: [], IsVisible: this.Property.IsVisible }
    }

    SetValue(value) {
        if (value && value.length > 0) this.setState({ DataList: value });
        else this.setState({ IsVisible: false });
    }

    GetColumn(title, dataIndex, render) {
        return { title, dataIndex, render }
    }

    SetResult(value) {
        return <div dangerouslySetInnerHTML={{ __html: value }}></div>
    }

    render() {
        if (this.state.DataList.length === 0 || !this.state.IsVisible) return null;
        const className = styles.DivTable
        return (
            <div className={className}>
                <Table dataSource={this.state.DataList} pagination={false} bordered={true} columns={this.Columns}></Table>
            </div>
        );
    }
}