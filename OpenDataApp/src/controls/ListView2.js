import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { ListView, ActivityIndicator, PullToRefresh } from "antd-mobile"
import DivView from "./DivView"
import SpanText from "./SpanText"

export default class ListView2 extends Index {
    constructor(props) {
        super(props)

        this.state = {
            IsRefreshing: false,
            IsLoadingMore: false
        }

        this.DataList = null
        this.ListDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    }

    static get defaultProps() {
        return {
            DataList: null,
            RenderHeader: function () { return null },
            RenderRow(rowData, sectionID, rowID) { return <DivView /> }
        }
    }

    EndReached() {
        this.props.onNextPage && this.props.onNextPage()
    }

    Refresh() {
        this.props.onRefresh && this.props.onRefresh()
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ IsLoadingMore: nextProps.IsLoadingMore, IsRefreshing: nextProps.IsRefreshing })

        if (nextProps.DataList !== null) {
            this.DataList = nextProps.DataList
        }
    }

    RenderFooter() {
        if (this.state.IsLoadingMore) {
            return (<ActivityIndicator size="large" color="#FE9502" style={{ marginTop: 10, marginBottom: 10 }} />)
        }

        return (<DivView style={{ height: 50 }}></DivView>)
    }

    render() {

        let { DataList } = this.props

        if (this.state.IsRefreshing && DataList === null) {
            DataList = this.DataList
        }

        const dataSource = DataList && DataList.length > 0 ? this.ListDataSource.cloneWithRows(DataList) : DataList && DataList.length === 0 ? [] : null

        return dataSource === null ? null : dataSource.length === 0 ?
            (
                <DivView><SpanText></SpanText>未搜索到相应结果！</DivView>
            )
            :
            (
                <ListView dataSource={dataSource}
                    renderRow={this.props.RenderRow}
                    onEndReached={this.EndReached.bind(this)}
                    onEndReachedThreshold={50}
                    renderHeader={this.props.RenderHeader}
                    pullToRefresh={
                        <PullToRefresh refreshing={this.state.IsRefreshing}
                            onRefresh={this.Refresh.bind(this)}
                            colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
                            progressBackgroundColor="#ffffff" />
                    }
                />
            )
    }
}