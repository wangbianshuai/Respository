import React from "react"
import DataGridView from "../components/DataGridView";
import * as Common from "../utils/Common";
import Index from "./Index"
import styles from "../styles/Index.css"

export default class ExcelImportMessageList extends Index {
    constructor(props) {
        super(props)

        this.Id = Common.CreateGuid()
        this.state = { Data: { MessageList: [], Message2: "" }, DataProperties: [] }
    }

    componentWillMount() {
        this.props.Property.LoadData = (data) => this.LoadData(data);
        this.LoadData(this.props.Data)
    }

    InitDataProperties(data) {
        let label = "错误提示";
        if (!Common.IsNullOrEmpty(data.Message2) && data.Message2.indexOf("操作成功") === 0) label = "信息";
        return [{ Name: "RowNum", Label: "行号", ColumnWidth: 80 },
        { Name: "Message", Label: label, ColumnWidth: 800 }]
    }

    LoadData(data) {
        this.props.Property.SetVisible(true);

        const dataProperties = this.InitDataProperties(data);
        Common.IsArray(data.MessageList) && data.MessageList.forEach((d) => d.key = Common.CreateGuid());

        this.setState({ Data: data, DataProperties: dataProperties })
    }

    render() {
        return <div className={styles.DivList}>
            {
                Common.IsNullOrEmpty(this.state.Data.Message2) ? null :
                    <div className={styles.DivText}><span>{this.state.Data.Message2}</span></div>
            }
            <DataGridView Page={this.props.Page} DataList={this.state.Data.MessageList} IsPaging={false}
                DataProperties={this.state.DataProperties} />
        </div>
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined) {
                if (this.props[key] !== nextProps[key]) { blChangedProps = true; break; }
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
    }
}