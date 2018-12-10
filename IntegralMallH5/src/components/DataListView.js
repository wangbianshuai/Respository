import React, { Component } from 'react'
import { View, Text, ListView,  ActivityIndicator } from "antd-mobile"
import ProductItem from "./ProductItem"
import styles from '../styles/DataListView.css'


export default class DataListView extends Component {
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
            IsInvest: false,
            IsScrollEnabled: true
        }
    }

    renderRow(rowData, sectionID, rowID) {
        if (this.props.DataList && parseInt(rowID, 10) === this.props.DataList.length - 1) {
            return (
                <View>
                    {this.RenderRowItem(rowData, sectionID, rowID)}
                    {this.RenderFooter()}
                </View>
            )
        }

        return this.RenderRowItem(rowData, sectionID, rowID)
    }

    RenderRowItem(rowData, sectionID, rowID) {
        if (this.props.IsProductItem) {
            return (
                <ProductItem RowData={rowData} Router={this.props.Router} EntityName={this.props.EntityName} SelectID={sectionID} RowID={rowID} />
            )
        }
        else if (this.props.IsManager) {
            return (
                <div> IsManager </div>
            )
        }
    }

    EndReached() {
        this.props.onNextPage && this.props.onNextPage()
    }

    Refresh() {
        this.props.onRefresh && this.props.onRefresh()
    }

    PropsChanged(nextProps) {
        this.setState({ IsLoadingMore: nextProps.IsLoadingMore, IsRefreshing: nextProps.IsRefreshing })

        if (nextProps.DataList !== null) {
            this.DataList = nextProps.DataList
        }
    }

    RenderFooter() {
        if (this.state.IsLoadingMore) {
            return (<ActivityIndicator size="large" color="#FE9502" style={{ marginTop: 10, marginBottom: 10 }} />)
        }

        return (<View style={{ height: 50 }}></View>)
    }

    render() {
        let { DataList } = this.props

        if (this.state.IsRefreshing && DataList === null) {
            DataList = this.DataList
        }

        const dataSource = DataList && DataList.length > 0 ? this.ListDataSource.cloneWithRows(DataList) : DataList && DataList.length === 0 ? [] : null

        return dataSource === null ? null : dataSource.length === 0 ?
            (
                <View><Text>未搜索到相应结果！</Text></View>
            )
            :
            (
                <ListView dataSource={dataSource}
                    style={styles.ListView}
                    renderRow={this.renderRow.bind(this)}
                    onEndReached={this.EndReached.bind(this)}
                    onEndReachedThreshold={50}
                    renderHeader={this.props.RenderHeader}                                
                />
            )
    }
}