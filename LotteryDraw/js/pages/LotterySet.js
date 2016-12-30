import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Text,
    View,
    Image,
    TouchableHighlight,
    Picker,
    ScrollView
} from 'react-native'
import styles from '../styles/LotterySet'
import * as ReactNative from "../utils/ReactNative"
import Header from '../components/Header'
import * as Common from '../utils/Common'
import * as LotteryType from "../actions/LotteryType"
import ProductPicker from "../components/ProductPicker"

class LotterySet extends Component {
    constructor(props) {
        super(props)

        const initData = this.GetInitLotteryType(props)

        this.state = {
            LotteryTypeId: initData === null ? "" : initData.LotteryTypeId,
            TypeName: initData === null ? "" : initData.TypeName,
            ProductId: "",
            ProductName: "",
            LotteryUserCount: 0
        }

        this.hardwareBackPress = this.handleBack.bind(this)
    }

    static get defaultProps() {
        return {
            LotteryTypeList: null
        }
    }

    componentDidMount() {
        ReactNative.AddBackPress(this.hardwareBackPress)

        this.props.LotteryTypeList === null && this.props.GetLotteryTypeList()
    }

    componentWillUnmount() {
        ReactNative.AddBackPress(this.hardwareBackPress)
    }

    componentWillUpdate(nextProps, nextState) {
        const initData = this.GetInitLotteryType(nextProps, this.state.LotteryTypeId)
        if (initData !== null) {
            this.setState(initData)
        }
    }

    GetInitLotteryType(props, lotteryTypeId) {
        const {LotteryTypeList} = props

        if (LotteryTypeList && LotteryTypeList.length > 0 && Common.StringIsNullOrEmpty(lotteryTypeId)) {
            const data = LotteryTypeList[0]

            return {
                LotteryTypeId: data.LotteryTypeId,
                TypeName: data.TypeName
            }
        }

        return null
    }

    handleBack() {
        return this.props.Router.pop()
    }

    LotteryTypeValueChange(value) {
        const list = this.props.LotteryTypeList.filter((item) => item.LotteryTypeId === value)
        const typeName = list.length === 1 ? list[0].TypeName : ""

        this.setState({
            TypeName: typeName,
            LotteryTypeId: value
        })
    }

    SelectProductChanged(data) {
        this.setState({
            ProductId: data.ProductId,
            ProductName: data.ProductName,
            LotteryUserCount: data.LotteryUserCount
        })
    }

    ToProductPage() {
        this.props.Router.push("ProductList")
    }

    ToLotteryTypePage() {
        this.props.Router.push("LotteryTypeList")
    }

    ToLotteryDraw() {
        this.ToDrawRecord("LotteryDraw")
    }

    ToLotteryRecord() {
        this.ToDrawRecord("LotteryRecord")
    }

    ToDrawRecord(name) {
        this.props.Router.push(name, {
            LotteryTypeId: this.state.LotteryTypeId,
            TypeName: this.state.TypeName,
            ProductId: this.state.ProductId,
            ProductName: this.state.ProductName,
            LotteryUserCount: this.state.LotteryUserCount
        })
    }

    render() {
        const {LotteryTypeList} = this.props

        return (
            <View style={styles.container}>
                <Header Router={this.props.Router} />
                <ScrollView>

                    <View style={styles.titleView}>
                        <Image style={styles.titleImage} source={require("../images/background_LotterySet.png")}></Image>
                        <View style={styles.button1View}>
                            <Image style={styles.button1Image1} source={require("../images/button1.png")}>
                                <TouchableHighlight style={styles.button1} underlayColor={null} onPress={this.ToProductPage.bind(this)}>
                                    <Text style={styles.button1Text}>奖品设置
                            </Text></TouchableHighlight></Image>
                            <Image style={styles.button1Image2} source={require("../images/button1.png")}>
                                <TouchableHighlight style={styles.button1} underlayColor={null} onPress={this.ToLotteryTypePage.bind(this)}>
                                    <Text style={styles.button1Text}>奖项设置
                            </Text></TouchableHighlight></Image>
                        </View>
                    </View>

                    <View style={styles.selectView}>
                        <View style={styles.cupView}>
                            <Image source={require("../images/select_bg.png")} style={styles.selectImage}>
                                <View style={styles.pickerView}>
                                    <Text style={styles.pickerText}>奖项选择</Text>
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
                            </Image>
                        </View>
                        <View style={styles.cupView}>
                            <Image source={require("../images/select_bg.png")} style={styles.selectImage}>
                                <ProductPicker LotteryTypeId={this.state.LotteryTypeId} ValueChanged={this.SelectProductChanged.bind(this)} />
                            </Image>
                        </View>
                    </View>

                    <View style={styles.bottomView}>
                        <Image source={require("../images/rect9.png")} style={styles.rectImage}>
                            <View style={styles.textCountView}>
                                <Text style={styles.textCount1}>该奖可中</Text>
                                <Text style={styles.textCount2}>{this.state.LotteryUserCount}人</Text>
                            </View>
                            <View style={styles.imageView2}>
                                <Image source={require("../images/button3.png")} style={styles.button3Image}>
                                    <TouchableHighlight style={styles.button3} underlayColor={null} onPress={this.ToLotteryDraw.bind(this)}>
                                        <Text style={styles.button3text}>开始抽奖</Text>
                                    </TouchableHighlight>
                                </Image>
                                <Image source={require("../images/button4.png")} style={styles.button4Image}>
                                    <TouchableHighlight style={styles.button4} underlayColor={null} onPress={this.ToLotteryRecord.bind(this)}>
                                        <Text style={styles.button4text}>中奖记录</Text>
                                    </TouchableHighlight>
                                </Image>
                            </View>
                        </Image>
                    </View>

                </ScrollView>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        LotteryTypeList: state.LotteryType.DataList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        GetLotteryTypeList() {
            return dispatch(LotteryType.GetLotteryTypeList())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LotterySet)