import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { connect } from 'react-redux'
import Router from './routers/router'
import GetRouteList from "./configs/PageRoute"
import * as ActionType from './configs/ActionType'

class Root extends Component {
    constructor(props) {
        super(props)
    }

    static get defaultProps() {
        return {
            RouteList: GetRouteList(),
            InitRouteName: "Index"
        }
    }

    GetRoute(name) {
        let list = this.props.RouteList.filter((item) => item.Name === name)
        return list.length ? list[0] : null
    }

    renderScene(route, navigator) {
        route.Index = route.Index || 0
        this.Router = this.Router || new Router(navigator, route, this.GetRoute.bind(this))
        if (route.Page) {
            return React.createElement(route.Page, {
                ...route.props,
                Router: this.Router
            })
        }
    }

    configureScene(route) {
        if (route.sceneConfig) {
            return route.sceneConfig;
        }
        return Navigator.SceneConfigs.FloatFromRight
    }

    render() {
        return (<Navigator
            initialRoute={this.GetRoute(this.props.InitRouteName)}
            configureScene={this.configureScene.bind(this)}
            renderScene={this.renderScene.bind(this)}
            />)
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        InitState() {
            dispatch({ type: ActionType.InitLotteryTypeState })
            dispatch({ type: ActionType.InitLotteryRecordState })
            dispatch({ type: ActionType.InitProductState })
            dispatch({ type: ActionType.InitUserInfoState })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
