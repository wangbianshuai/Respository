import React, { Component } from "react"
import { connect } from 'react-redux'

class ProductList extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    static get defaultProps() {
        return {
            LoginInfo: null
        }
    }

    componentWillMount() {
        if (!this.JudgeLogin()) {
            this.props.ToPage("Login")
            return
        }
    }

    JudgeLogin() {
        return this.props.LoginInfo !== null && this.props.LoginInfo.Ack.IsSuccess
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>ProductList</div>
        )
    }
}

function mapStateToProps(state) {
    return {
        LoginInfo: state.User.LoginInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
