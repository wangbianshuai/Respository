import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Text,
    View,
    TouchableHighlight,
    Picker
} from 'react-native'
import styles from '../styles/LotterySet'
import * as Common from '../utils/Common'
import * as Product from "../actions/Product"

class ProductPicker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            LotteryTypeId: "",
            ProductId: "",
            ProductList: [],
            IsInitLoadProduct: false
        }
    }

    static get defaultProps() {
        return {
            ProductList: null
        }
    }

    componentDidMount() {
        this.setState({ IsInitLoadProduct: this.props.ProductList === null })
        this.props.ProductList === null && this.props.GetProductList()

        if (this.props.ProductList !== null) {
            const data = this.GetInitProduct(this.props, [], "", "", true)

            if (data.LotteryTypeId && data.ProductId) {
                this.setState(data)
            }
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.LotteryTypeId !== this.state.LotteryTypeId) {
            const data = this.GetInitProduct(nextProps, this.state.ProductList, this.state.LotteryTypeId, this.state.ProductId, this.state.IsInitLoadProduct)

            if (data.LotteryTypeId || data.ProductId) {
                if (this.state.IsInitLoadProduct) { data.IsInitLoadProduct = false }
                this.setState(data)
            }
        }
    }

    GetInitProduct(props, list, lotteryTypeId, productId, blChanged) {
        const {ProductList, LotteryTypeId} = props

        var data = {}

        if (ProductList && ProductList.length && LotteryTypeId !== lotteryTypeId) {
            list = ProductList.filter((item) => item.LotteryTypeId === LotteryTypeId)

            data.ProductList = list
            data.LotteryTypeId = LotteryTypeId
        }

        if (list && list.length > 0 && Common.StringIsNullOrEmpty(productId)) {
            const data2 = list[0]

            data.ProductId = data2.ProductId

            blChanged && props.ValueChanged(data2)
        }

        return data
    }

    ProductValueChange(value, index) {
        if (value !== this.state.ProductId) {
            this.setState({
                ProductId: value
            })
        }

        const list = this.state.ProductList.filter((item) => item.ProductId === value)
        list.length === 1 && this.props.ValueChanged(list[0])
    }

    render() {
        const {ProductList} = this.state
        return (
            <View style={styles.pickerView}>
                <Text style={styles.pickerText}>奖品选择</Text>
                {
                    ProductList ?
                        <Picker style={styles.selectPicker}
                            selectedValue={this.state.ProductId}
                            onValueChange={this.ProductValueChange.bind(this)}>
                            {
                                ProductList.map((item) =>
                                    <Picker.Item key={Common.CreateGuid()} label={item.ProductName} value={item.ProductId} />
                                )
                            }
                        </Picker>
                        : null
                }
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        ProductList: state.Product.DataList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        GetProductList() {
            return dispatch(Product.GetProductList())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPicker)