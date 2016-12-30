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
import * as LotteryType from "../actions/LotteryType"
import styles from "../styles/ListPage"
import * as ActionType from '../configs/ActionType'

class LotteryTypeList extends Component {
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

        this.props.DataList === null && this.props.GetLotteryTypeList()
    }

    componentWillUnmount() {
        ReactNative.AddBackPress(this.hardwareBackPress)
    }

    handleBack() {
        return this.props.Router.pop()
    }

    ToNewAddPage() {
        this.props.Router.push("LotteryTypeEdit")
    }

    ToEditPage(rowData) {
        this.props.Router.push("LotteryTypeEdit", { LotteryTypeId: rowData.LotteryTypeId })
    }

    Delete(rowData) {
        ReactNative.confirm("确认删除吗？").then(() => { this.props.DeleteLotteryType(rowData.LotteryTypeId) })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.Opertion !== null && this.props.Opertion === null) {
            if (nextProps.Opertion.IsSuccess && nextProps.Opertion.ActionType === ActionType.DeleteLotteryType) {
                this.props.GetLotteryTypeList()
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
                    <Text style={styles.itemText}>{rowData.TypeName}</Text>
                    <Text style={styles.itemText}>{rowData.IsMutex === 1 ? "互斥" : ""}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        let {DataList, ds} = this.props
        const dataSource = DataList && DataList.length > 0 ? ds.cloneWithRows(DataList) : null

        return (
            <View style={styles.container}>
                <Header Router={this.props.Router} Title="奖项列表" RightText="添加" RightOnPress={this.ToNewAddPage.bind(this)} />
                {dataSource === null ? null : <ListView dataSource={dataSource} renderRow={this.renderRow.bind(this)} />}
            </View >
        )
    }
}

function mapStateToProps(state) {
    const {LotteryType} = state
    return {
        DataList: LotteryType.DataList,
        Opertion: LotteryType.Opertion
    }
}

function mapDispatchToProps(dispatch) {
    return {
        GetLotteryTypeList() {
            return dispatch(LotteryType.GetLotteryTypeList())
        },
        DeleteLotteryType(id) {
            return dispatch(LotteryType.DeleteLotteryType(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LotteryTypeList)