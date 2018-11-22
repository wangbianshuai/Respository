import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Text,
    View,
    TextInput,
    Picker
} from 'react-native'
import * as ReactNative from "../utils/ReactNative"
import Header from '../components/Header'
import * as Common from '../utils/Common'
import * as Product from "../actions/Product"
import * as LotteryType from "../actions/LotteryType"
import styles from "../styles/EditPage"
import * as ActionType from '../configs/ActionType'

class ProductEdit extends Component {
    constructor(props) {
        super(props)

        const IsUpdate = !Common.StringIsNullOrEmpty(props.ProductId)

        this.state = {
            IsUpdate: IsUpdate,
            Title: IsUpdate ? "修改奖项" : "新增奖项",
            ProductName: "",
            ProductId: "",
            ProductImage: "",
            LotteryUserCount: "0",
            TypeName: "",
            LotteryTypeId: ""
        }

        this.hardwareBackPress = this.handleBack.bind(this)
    }

    static get defaultProps() {
        return {
            Data: null,
            Opertion: null,
            LotteryTypeList: null,
            PropertyNames: ["ProductId", "TypeName", "ProductName", "ProductImage", "LotteryUserCount", "LotteryTypeId"]
        }
    }

    componentDidMount() {
        ReactNative.AddBackPress(this.hardwareBackPress)

        this.props.LotteryTypeList === null && this.props.GetLotteryTypeList()

        this.props.GetProduct(this.props.ProductId)
    }

    componentWillUnmount() {
        ReactNative.AddBackPress(this.hardwareBackPress)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.Opertion !== null && this.props.Opertion === null) {
            if (nextProps.Opertion.IsSuccess && nextProps.Opertion.ActionType === ActionType.SaveProduct) {
                this.props.GetProductList()
                ReactNative.alert("保存成功！").then(() => { this.handleBack() })
            }
            return false
        }
        return true
    }

    componentWillUpdate(nextProps, nextState) {
        if (Common.StringIsNullOrEmpty(this.state.ProductId)
            && nextProps.Data !== null
            && this.props.ProductId == nextProps.Data.ProductId) {

            let data = {}
            for (var key in nextProps.Data) {
                if (this.state.hasOwnProperty(key)) {
                    data[key] = Common.StringIsNullOrEmpty(nextProps.Data[key]) ? "" : nextProps.Data[key].toString()
                }
            }

            this.setState(data)
        }
    }

    handleBack() {
        return this.props.Router.pop()
    }

    Save() {
        let data = {}
        this.props.PropertyNames.forEach((name) => {
            data[name] = this.state[name]
            if (typeof (data[name]) === "string") {
                data[name] = Common.StringTrim(data[name])
            }
        }, this)

        data.IsMutex = this.state.IsMutex2 === true ? 1 : 0

        if (Common.StringIsNullOrEmpty(data.ProductName)) {
            ReactNative.alert("请输入奖品名称！")
            return
        }

        if (Common.StringIsNullOrEmpty(data.LotteryTypeId) && this.props.LotteryTypeList && this.props.LotteryTypeList.length > 0) {
            const lt = this.props.LotteryTypeList[0]
            data.LotteryTypeId = lt.LotteryTypeId
            data.TypeName = lt.TypeName
        }

        if (Common.StringIsNullOrEmpty(data.LotteryTypeId)) {
            ReactNative.alert("请选择奖项！")
            return
        }

        const count = parseInt(data.LotteryUserCount, 10)

        if (!(count > 0 && Common.IsInt(data.LotteryUserCount))) {
            ReactNative.alert("中奖人奖应大于零自然数！")
            return
        }

        data.LotteryUserCount = count

        this.props.SaveProduct(data)
    }

    ChangeValue(name, value) {
        let data = {}
        data[name] = value
        this.setState(data)
    }

    LotteryTypeValueChange(value) {
        const list = this.props.LotteryTypeList.filter((item) => item.LotteryTypeId === value)
        const typeName = list.length === 1 ? list[0].TypeName : ""

        this.setState({
            TypeName: typeName,
            LotteryTypeId: value
        })
    }

    render() {
        const {LotteryTypeList} = this.props

        return (
            <View style={styles.container}>
                <Header Router={this.props.Router} Title={this.state.Title} RightText="保存" RightOnPress={this.Save.bind(this)} />
                <View style={styles.editView}>
                    <Text style={styles.labelText}>奖品名称</Text>
                    <TextInput maxLength={50}
                        style={styles.textInput}
                        onChangeText={this.ChangeValue.bind(this, "ProductName")}
                        value={this.state.ProductName} />
                </View>
                <View style={styles.editView}>
                    <Text style={styles.labelText}>奖品图片</Text>
                    <TextInput maxLength={200}
                        style={styles.textInput}
                        onChangeText={this.ChangeValue.bind(this, "ProductImage")}
                        value={this.state.ProductImage} />
                </View>
                <View style={styles.editView}>
                    <Text style={styles.labelText}>奖项选择</Text>
                    <View style={styles.pickerView}>
                        {
                            LotteryTypeList ?
                                <Picker style={styles.selectPicker}
                                    selectedValue={this.state.LotteryTypeId}
                                    onValueChange={this.LotteryTypeValueChange.bind(this)}>
                                    {
                                        LotteryTypeList.map((item) =>
                                            <Picker.Item key={Common.CreateGuid()} label={item.TypeName} value={item.LotteryTypeId} />
                                        )
                                    }
                                </Picker>
                                : null
                        }
                    </View>
                </View>
                <View style={styles.editView}>
                    <Text style={styles.labelText}>中奖人数</Text>
                    <TextInput maxLength={5} keyboardType="numeric"
                        style={styles.textInput}
                        onChangeText={this.ChangeValue.bind(this, "LotteryUserCount")}
                        value={this.state.LotteryUserCount} />
                </View>
            </View >
        )
    }
}

function mapStateToProps(state) {
    const {Product, LotteryType} = state
    return {
        Data: Product.Data,
        Opertion: Product.Opertion,
        LotteryTypeList: LotteryType.DataList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        GetProduct(id) {
            return dispatch(Product.GetProduct(id))
        },
        SaveProduct(entityData) {
            return dispatch(Product.SaveProduct(entityData))
        },
        GetProductList() {
            return dispatch(Product.GetProductList())
        },
        GetLotteryTypeList() {
            return dispatch(LotteryType.GetLotteryTypeList())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductEdit)