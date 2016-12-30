import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Text,
    View,
    Image,
    TouchableHighlight,
    ListView
} from 'react-native'
import * as ReactNative from "../utils/ReactNative"
import Header from '../components/Header'
import * as Common from '../utils/Common'
import * as Product from "../actions/Product"
import styles from "../styles/ListPage"
import * as ActionType from '../configs/ActionType'

class ProductList extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }

        this.hardwareBackPress = this.handleBack.bind(this)
    }

    static get defaultProps() {
        return {
            DataList: null,
            ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        }
    }

    componentDidMount() {
        ReactNative.AddBackPress(this.hardwareBackPress)

        this.props.DataList === null && this.props.GetProductList()
    }

    componentWillUnmount() {
        ReactNative.AddBackPress(this.hardwareBackPress)
    }

    handleBack() {
        return this.props.Router.pop()
    }

    ToNewAddPage() {
        this.props.Router.push("ProductEdit")
    }

    ToEditPage(rowData) {
        this.props.Router.push("ProductEdit", { ProductId: rowData.ProductId })
    }

    Delete(rowData) {
        ReactNative.confirm("确认删除吗？").then(() => { this.props.DeleteProduct(rowData.ProductId) })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.Opertion !== null && this.props.Opertion === null) {
            if (nextProps.Opertion.IsSuccess && nextProps.Opertion.ActionType === ActionType.DeleteProduct) {
                this.props.GetProductList()
            }
            return false
        }
        return true
    }

    renderRow(rowData, sectionID, rowID, highlightRow) {
        return (
            <TouchableHighlight style={styles.itemViewTouch} key={Common.CreateGuid()} underlayColor="#cccccc"
                onPress={this.ToEditPage.bind(this, rowData)} onLongPress={this.Delete.bind(this, rowData)}>
                <View style={styles.itemView}>
                    <Image style={styles.itemImage} source={require("../images/Logo.png")}></Image>
                    <Text style={styles.itemText}>{rowData.ProductName}</Text>
                    <Text style={styles.itemText}>{rowData.TypeName}</Text>
                    <Text style={styles.itemText}>中奖人数{rowData.LotteryUserCount}人</Text>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        let {DataList, ds} = this.props
        const dataSource = DataList && DataList.length > 0 ? ds.cloneWithRows(DataList) : null

        return (
            <View style={styles.container}>
                <Header Router={this.props.Router} Title="奖品列表" RightText="添加" RightOnPress={this.ToNewAddPage.bind(this)} />
                {dataSource === null ? null : <ListView dataSource={dataSource} renderRow={this.renderRow.bind(this)} />}
            </View >
        )
    }
}

function mapStateToProps(state) {
    const {Product} = state
    return {
        DataList: Product.DataList,
        Opertion: Product.Opertion
    }
}

function mapDispatchToProps(dispatch) {
    return {
        GetProductList() {
            return dispatch(Product.GetProductList())
        },
        DeleteProduct(id) {
            return dispatch(Product.DeleteProduct(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)