import React, { Component } from "react"
import { ListView } from "antd-mobile"
// import * as Common from "../utils/Common"
import styles from "../styles/MyCreditListView.css"
import CreditDetail from "./CreditDetail"

export default class MyCreditListView extends Component {
    constructor(props) {
        super(props)

        this.DataList = null
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })

        this.state = {
            dataSource: this.dataSource.cloneWithRows({}),
            isLoading: true,
        }
    }

    componentDidMount() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.props.DataList),
            isLoading: false,
        })
    }

    RenderFooter() {
        return (
            <div className={styles.bottomdiv}>
                <img src={require("../images/bottomimg1.png")} alt="icon" style={{ marginTop: "1rem" }} />
                <div>{this.state.isLoading ? '加载中' : '我是有底线的'}</div>
                <div className={styles.blankdiv} />
            </div>
        )
    }

    renderList() {
        const row = (dataRow) => {
            return (
                //由于ListView row默认只能一行显示，如果要一行显示两条数据，则需要更新dataRow的数据类型，从后台接口获取到的产品列表重新组装成
                //一个产品数组的集合，一个产品数组里面放两个产品
              
                <div styles={{ width: '100%' }} >
                     <CreditDetail RowData={dataRow} />
                </div>
            )
        }

        return (
            <ListView
                style={{
                    height: document.documentElement.clientHeight,
                    overflow: 'auto',
                    width: '100%',
                }}
                contentContainerStyle={{ flexDirection: 'column', flexWrap: 'nowrap', width: '100%' }}
                enableEmptySections={true}
                bounces={true}
                dataSource={this.state.dataSource}
                renderFooter={this.RenderFooter.bind(this)}
                renderRow={row}
                pageSize={6}
                scrollRenderAheadDistance={500}
                scrollEventThrottle={20}
                onEndReachedThreshold={10}
            />
        )
    }

    render() {
        let { DataList } = this.props

        if (this.state.isLoading && DataList === null) {
            DataList = this.DataList
        }

        const dataSource = DataList && DataList.length > 0 ? this.dataSource.cloneWithRows(DataList) : DataList && DataList.length === 0 ? [] : null

        return (
            <div>
                {dataSource.length === 0 ? (<div style={{ padding: 30, textAlign: 'center' }}>暂时没有积分</div>) : this.renderList()}
            </div>
        )
    }
}
