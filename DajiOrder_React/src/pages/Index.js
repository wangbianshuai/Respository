import React, { Component } from "react"
import { connect } from 'react-redux'

class Index extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    static get defaultProps() {
        return {

        }
    }

    ToProductList() {
        this.props.ToPage("ProductList", { Name: "ProductList" })
    }

    render() {
        return (
            <div>欢迎大集订单
             <span><a href="?page=Login">登录</a></span>
                <input type="button" value="产品列表" onClick={this.ToProductList.bind(this)} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
