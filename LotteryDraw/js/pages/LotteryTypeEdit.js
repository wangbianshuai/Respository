import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Text,
    View,
    TextInput,
    Switch
} from 'react-native'
import * as ReactNative from "../utils/ReactNative"
import Header from '../components/Header'
import * as Common from '../utils/Common'
import * as LotteryType from "../actions/LotteryType"
import styles from "../styles/EditPage"
import * as ActionType from '../configs/ActionType'

class LotteryTypeEdit extends Component {
    constructor(props) {
        super(props)

        const IsUpdate = !Common.StringIsNullOrEmpty(props.LotteryTypeId)

        this.state = {
            IsUpdate: IsUpdate,
            Title: IsUpdate ? "修改奖项" : "新增奖项",
            LotteryTypeId: "",
            TypeName: "",
            LogoUrl: "",
            IsMutex2: false
        }

        this.hardwareBackPress = this.handleBack.bind(this)
    }

    static get defaultProps() {
        return {
            Data: null,
            Opertion: null,
            PropertyNames: ["LotteryTypeId", "TypeName", "LogoUrl", "IsMutex"]
        }
    }

    componentDidMount() {
        ReactNative.AddBackPress(this.hardwareBackPress)

        this.props.GetLotteryType(this.props.LotteryTypeId)
    }

    componentWillUnmount() {
        ReactNative.AddBackPress(this.hardwareBackPress)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.Opertion !== null && this.props.Opertion === null) {
            if (nextProps.Opertion.IsSuccess && nextProps.Opertion.ActionType === ActionType.SaveLotteryType) {
                this.props.GetLotteryTypeList()
                ReactNative.alert("保存成功！").then(() => { this.handleBack() })
            }
            return false
        }
        return true
    }

    componentWillUpdate(nextProps, nextState) {
        if (Common.StringIsNullOrEmpty(this.state.LotteryTypeId)
            && nextProps.Data !== null
            && this.props.LotteryTypeId == nextProps.Data.LotteryTypeId) {

            let data = {}
            for (var key in nextProps.Data) {
                if (this.state.hasOwnProperty(key)) {
                    data[key] = nextProps.Data[key]
                }
            }
            data.IsMutex2 = nextProps.Data.IsMutex === 1

            this.setState(data)
        }
    }

    handleBack() {
        return this.props.Router.pop()
    }

    Save() {
        var data = {}
        this.props.PropertyNames.forEach((name) => {
            data[name] = this.state[name]
            if (typeof (data[name]) === "string") {
                data[name] = Common.StringTrim(data[name])
            }
        }, this)

        data.IsMutex = this.state.IsMutex2 === true ? 1 : 0

        if (Common.StringIsNullOrEmpty(data.TypeName)) {
            ReactNative.alert("请输入奖项名称！")
            return
        }

        this.props.SaveLotteryType(data)
    }

    ChangeValue(name, value) {
        let data = {}
        data[name] = value
        this.setState(data)
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Header Router={this.props.Router} Title={this.state.Title} RightText="保存" RightOnPress={this.Save.bind(this)} />
                <View style={styles.editView}>
                    <Text style={styles.labelText}>奖项名称</Text>
                    <TextInput maxLength={50}
                        style={styles.textInput}
                        onChangeText={this.ChangeValue.bind(this, "TypeName")}
                        value={this.state.TypeName} />
                </View>
                <View style={styles.editView}>
                    <Text style={styles.labelText}>Logo地址</Text>
                    <TextInput maxLength={200}
                        style={styles.textInput}
                        onChangeText={this.ChangeValue.bind(this, "LogoUrl")}
                        value={this.state.LogoUrl} />
                </View>
                <View style={styles.switchView}>
                    <Text style={styles.labelText}>是否互斥</Text>
                    <Switch
                        style={styles.switch}
                        onValueChange={this.ChangeValue.bind(this, "IsMutex2")}
                        value={this.state.IsMutex2} />
                </View>
            </View >
        )
    }
}

function mapStateToProps(state) {
    const {LotteryType} = state
    return {
        Data: LotteryType.Data,
        Opertion: LotteryType.Opertion
    }
}

function mapDispatchToProps(dispatch) {
    return {
        GetLotteryType(id) {
            return dispatch(LotteryType.GetLotteryType(id))
        },
        SaveLotteryType(entityData) {
            return dispatch(LotteryType.SaveLotteryType(entityData))
        },
        GetLotteryTypeList() {
            return dispatch(LotteryType.GetLotteryTypeList())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LotteryTypeEdit)