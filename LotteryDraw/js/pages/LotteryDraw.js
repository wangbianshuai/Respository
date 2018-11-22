import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Text,
    View,
    Image,
    TouchableHighlight
} from 'react-native'
import styles from '../styles/LotteryDraw'
import * as ReactNative from "../utils/ReactNative"
import Header from '../components/Header'
import * as Common from '../utils/Common'
import * as UserInfo from "../actions/UserInfo"
import * as RecordAction from "../actions/LotteryRecord"
import * as ActionType from '../configs/ActionType'

class LotteryDraw extends Component {
    constructor(props) {
        super(props)

        this.state = {
            LotteryTypeId: props.LotteryTypeId,
            TypeName: props.TypeName,
            ProductId: props.ProductId,
            ProductName: props.ProductName,
            LotteryUserCount: props.LotteryUserCount,
            LotteryUserCount2: 0,
            NickName: "",
            IsDraw: true,
            IsStartDraw: false,
            IsShowTime: false,
            SecondNum: 5,
            UserList: [],
            IsLoadRecord: false
        }

        props.ClearUserList()
        props.ClearLotteryRecordList()

        this.hardwareBackPress = this.handleBack.bind(this)
    }

    static get defaultProps() {
        return {
            UserList: null,
            RecordList: null
        }
    }

    componentDidMount() {
        ReactNative.AddBackPress(this.hardwareBackPress)

        this.props.GetUserList(this.props.LotteryTypeId)
        this.props.GetLotteryRecordList(this.props.LotteryTypeId, this.props.ProductId)
    }

    componentWillUnmount() {
        ReactNative.AddBackPress(this.hardwareBackPress)

        this.StopInterval()
        this.StopInterval2()
        this.StopTimeout()
    }

    StopInterval() {
        this.SelectIndex = 0
        this.IntervalId > 0 && clearInterval(this.IntervalId)
    }

    StopInterval2() {
        this.IntervalId2 > 0 && clearInterval(this.IntervalId2)
    }

    StopTimeout() {
        this.TimeoutId > 0 && clearTimeout(this.TimeoutId)
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.RecordList !== null && nextProps.UserList !== null) {
            !this.IsLoadRecord && this.GetRecordList(nextProps.RecordList)
            !this.IsLoadUser && this.SetDrawUserList(nextProps.UserList)
        }
    }

    IsLoadRecord = false
    IsLoadUser = false
    DrawUserList = []
    UserInfoList = []
    IntervalId = 0
    IntervalId2 = 0
    TimeoutId = 0
    SelectIndex = 0
    SelectUserInfo = {}
    IsStartDraw = true

    SetDrawUserList(userList) {
        this.IsLoadUser = true
        this.DrawUserList = []

        this.UserInfoList = userList.map((item) => {
            item.Index2 = Math.random()
            return item
        })

        this.UserInfoList = this.UserInfoList.sort((a, b) => {
            return a.Index2 > b.Index2 ? 1 : -1
        })

        if (this.UserInfoList.length > 0 && this.IsStartDraw) {
            this.SetLetteryDraw()
        }
    }

    GetRecordList(list) {
        this.IsLoadRecord = true
        let iCount = 0
        list && list.forEach((item) => {
            iCount += item.LotteryStatus === 1 ? 1 : 0
        })

        this.IsStartDraw = this.state.LotteryUserCount > iCount

        this.setState({
            LotteryUserCount2: iCount,
            IsDraw: this.state.LotteryUserCount > iCount
        })
    }

    SetLetteryDraw() {
        var that = this
        this.StopInterval()
        this.IntervalId = setInterval(() => {
            that.ShowUserInfo()
            that.SelectIndex += 1
        }, 100)
    }

    ShowUserInfo() {
        if (this.SelectIndex >= this.UserInfoList.length) {
            this.SelectIndex = 0
        }

        this.SelectUserInfo = this.UserInfoList[this.SelectIndex]

        this.setState({
            NickName: this.SelectUserInfo.NickName
        })
    }

    bindTapEnd() {
        if (this.IsEnd) {
            return
        }
        if (this.UserInfoList.length == 0) {
            ReactNative.alert("未有员工参与抽奖！")
            return;
        }

        if (this.state.IsStartDraw) {
            this.IsEnd = false
            this.setState({
                IsStartDraw: false
            })

            this.DrawUserList = []
            this.IsLoadUser = false
            this.props.ClearUserList()
            this.props.GetUserList(this.props.LotteryTypeId)
        }
        else {
            this.IsEnd = true
            this.setState({
                IsDraw: false,
                IsShowTime: true,
                SecondNum: 5
            })

            this.ShowSecondNum()
        }
    }

    ShowSecondNum() {
        var that = this
        this.StopInterval2()
        this.IntervalId2 = setInterval(() => {
            that.SetSencondNum()
        }, 1000)
    }

    SetSencondNum() {
        let secondNum = this.state.SecondNum - 1
        var that = this

        var data = {}

        if (secondNum === 0) {
            this.StopInterval()
            this.StopInterval2()

            this.SetDrawUser()

            let iCount2 = this.state.LotteryUserCount2

            data.IsShowTime = false
            data.NickName = this.SelectUserInfo.NickName
            data.LotteryUserCount2 = iCount2 + 1

            if (this.state.LotteryUserCount === data.LotteryUserCount2) {
                this.StopTimeout()
                this.TimeoutId = setTimeout(function () {
                    that.RedirectToRecord()
                }, 3000)
            }
            else {
                data.IsDraw = true
                data.IsStartDraw = true
                this.IsEnd = false
            }
        }

        data.SecondNum = secondNum

        this.setState(data)
    }

    RedirectToRecord() {
        this.props.Router.replace("LotteryRecord", {
            LotteryTypeId: this.state.LotteryTypeId,
            TypeName: this.state.TypeName,
            ProductId: this.state.ProductId,
            ProductName: this.state.ProductName,
            LotteryUserCount: this.state.LotteryUserCount
        })
    }

    SetDrawUser() {
        var data = Object.assign({}, this.SelectUserInfo)

        data.LotteryTypeId = this.props.LotteryTypeId
        data.ProductId = this.props.ProductId
        data.TypeName = this.props.TypeName
        data.ProductName = this.props.ProductName
        data.LotteryStatus = 1

        this.DrawUserList.push(data)

        this.props.SaveLotteryRecordList(this.DrawUserList)
    }

    handleBack() {
        return this.props.Router.pop()
    }

    render() {
        return (
            <View style={styles.container}>
                <Header Router={this.props.Router} />

                <View style={styles.titleView}>
                    <Image style={styles.titleImage} source={require("../images/draw_bg.png")}>
                        <View style={styles.UserView}>
                            <Text style={styles.userViewText}>{this.state.NickName}</Text>
                        </View>
                    </Image>
                </View>

                <View style={styles.DrawView}>
                    {
                        this.state.IsDraw ?
                            <View style={styles.ButtonView2}>
                                <View style={styles.ImageView2}>
                                    <Image source={require("../images/button3.png")} style={styles.Button3Image}>
                                        <TouchableHighlight style={styles.button3} underlayColor={null} onPress={this.bindTapEnd.bind(this)}>
                                            <Text style={styles.Button3Text}>{this.state.IsStartDraw ? "开始抽奖" : "开奖"}</Text>
                                        </TouchableHighlight>
                                    </Image>
                                </View>
                            </View>
                            : null
                    }
                    {
                        this.state.IsShowTime ?
                            <View style={styles.ViewTime}>
                                <Text style={styles.TimeText}>{this.state.SecondNum}</Text>
                            </View>
                            : null
                    }
                </View>

                <View style={styles.ViewType}>
                    <View style={styles.ViewTypeView}>
                        <Image source={require("../images/redpackage.png")} style={styles.ViewTypeViewImage}>
                            <View style={styles.TextView1}>
                                <Text style={styles.TextView1text1}>{this.state.TypeName}</Text>
                                <Text style={styles.TextView1text2}>{this.state.ProductName}</Text>
                            </View>
                            <View style={styles.TextView2}>
                                <View style={styles.TextView3}>
                                    <Text style={styles.TextView3text1}>应中奖</Text>
                                    <Text style={styles.TextView3text2}>{this.state.LotteryUserCount}人</Text>
                                </View>
                                <View style={styles.TextView3}>
                                    <Text style={styles.TextView3text1}>已中奖</Text>
                                    <Text style={styles.TextView3text2}>{this.state.LotteryUserCount2}人</Text>
                                </View>
                            </View>
                        </Image>
                    </View>

                </View>
            </View >
        )
    }
}

function mapStateToProps(state) {
    const {UserInfo, LotteryRecord} = state
    return {
        UserList: UserInfo.DataList,
        RecordList: LotteryRecord.DataList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        GetUserList(lotteryTypeId) {
            return dispatch(UserInfo.GetUserList(lotteryTypeId))
        },
        GetLotteryRecordList(lotteryTypeId, productId) {
            return dispatch(RecordAction.GetLotteryRecordList(lotteryTypeId, productId))
        },
        ClearUserList() {
            return dispatch({ data: null, type: ActionType.GetUserList })
        },
        ClearLotteryRecordList(lotteryTypeId) {
            return dispatch({ data: null, type: ActionType.GetLotteryRecordList })
        },
        SaveLotteryRecordList(recordList) {
            return dispatch(RecordAction.SaveLotteryRecordList(recordList))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LotteryDraw)