import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as Common from "./utils/Common"
import PageRoute from "./configs/PageRoute"

class Root extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Component: this.GetComponent(Common.GetProductValue(props.QueryString, "page") || "Index", )
        }
    }

    static get defaultProps() {
        return {
            QueryString: Common.GetQueryString(),
            PageList: PageRoute()
        }
    }

    GetComponent(name, props = {}) {
        props = props || {}
        props.ToPage = this.ToPage.bind(this)
        const list = this.props.PageList.filter(item => item.Name.toLowerCase() === name.toLowerCase())
        if (list.length == 1) {
            return React.createElement(list[0].Page, {
                ...props
            })
        }

        return null
    }

    ToPage(name, props) {
        this.setState({
            Component: this.GetComponent(name, props)
        })
    }

    render() {
        return this.state.Component
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

export default connect(mapStateToProps, mapDispatchToProps)(Root)
