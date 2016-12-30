import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Text,
    View,
    Image,
    TouchableHighlight,
    ScrollView
} from 'react-native'
import styles from '../styles/LotteryRecord'
import * as ReactNative from "../utils/ReactNative"
import Header from '../components/Header'
import * as Common from '../utils/Common'
import * as RecordAction from "../actions/LotteryRecord"
import * as ActionType from '../configs/ActionType'

class LotteryRecord extends Component {
    constructor(props) {
        super(props)

        this.state = {
            LotteryTypeId: props.LotteryTypeId,
            TypeName: props.TypeName,
            ProductId: props.ProductId,
            ProductName: props.ProductName,
            LotteryUserCount: props.LotteryUserCount
        }

        this.hardwareBackPress = this.handleBack.bind(this)
    }

    static get defaultProps() {
        return {
            DataList: null
        }
    }

    componentDidMount() {
        ReactNative.AddBackPress(this.hardwareBackPress)

        this.props.GetLotteryRecordList(this.props.LotteryTypeId, this.props.ProductId)
    }

    componentWillUnmount() {
        ReactNative.AddBackPress(this.hardwareBackPress)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.Opertion !== null && this.props.Opertion === null) {
            if (nextProps.Opertion.IsSuccess && nextProps.Opertion.ActionType === ActionType.SetLotteryStatusInValid) {
                this.props.GetLotteryRecordList(this.props.LotteryTypeId, this.props.ProductId)
            }
            return false
        }
        return true
    }

    handleBack() {
        return this.props.Router.pop()
    }

    SetValid(data) {
        if (data.LotteryStatus === 1) {
            ReactNative.confirm("确认作废吗？").then(() => { this.props.SetLotteryStatusInValid(data.RecordId) })
        }
    }

    renderRecord(data) {
        return (
            <TouchableHighlight style={styles.itemViewTouch} key={Common.CreateGuid()} underlayColor="#cccccc"
                onLongPress={this.SetValid.bind(this, data)}>
                <View style={styles.itemView}>
                    <Image style={styles.itemImage} source={{ uri: data.AvatarUrl }}></Image>
                    <Text style={styles.itemText}>{data.NickName}</Text>
                    <Text style={styles.itemText2}>{data.LotteryStatus === 0 ? "作废" : ""}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    GetLotteryUserCount2(list) {
        let iCount = 0
        list && list.forEach((item) => {
            iCount += item.LotteryStatus === 1 ? 1 : 0
        })
        return iCount
    }

    render() {
        const {DataList} = this.props
        const LotteryUserCount2 = this.GetLotteryUserCount2(DataList)

        return (
            <View style={styles.container}>
                <Header Router={this.props.Router} />
                <ScrollView>

                    <View style={styles.titleView}>
                        <Image style={styles.titleImage} source={require("../images/record_bg.png")}>
                            <View style={styles.ViewType}>
                                <View style={styles.TextView1}>
                                    <Text style={styles.view1text1}>{this.state.TypeName}</Text>
                                    <Text style={styles.view1text2}>{this.state.ProductName}</Text>
                                </View>
                                <View style={styles.TextView2}>
                                    <Text style={styles.view2text1}>应中奖</Text>
                                    <Text style={styles.view2text2}>{this.state.LotteryUserCount}人</Text>
                                </View>
                                <View style={styles.TextView2}>
                                    <Text style={styles.view2text1}>实中奖</Text>
                                    <Text style={styles.view2text2}>{LotteryUserCount2}人</Text>
                                </View>
                            </View>
                        </Image>
                    </View>

                    <View style={styles.ItemListView}>
                        <View style={styles.ViewRecordTitle}>
                            <Image source={require("../images/user_bg.png")} style={styles.RecordTitleImage}></Image>
                        </View>
                        {
                            DataList && DataList.map((item) => (this.renderRecord)(item))
                        }
                        <View style={styles.ViewBottom}>
                            <Image source={require("../images/record_bottom.png")} style={styles.ViewBottomImage}></Image>
                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }
}

function mapStateToProps(state) {
    const {LotteryRecord} = state
    return {
        DataList: LotteryRecord.DataList,
        Opertion: LotteryRecord.Opertion
    }
}

function mapDispatchToProps(dispatch) {
    return {
        GetLotteryRecordList(lotteryTypeId, productId) {
            return dispatch(RecordAction.GetLotteryRecordList(lotteryTypeId, productId))
        },
        SetLotteryStatusInValid(id) {
            return dispatch(RecordAction.SetLotteryStatusInValid(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LotteryRecord)