import React, { Component } from 'react'

class App extends Component {
    render() {
        return this.props.children
    }
}

export default {
    path: '/',
    component: App,
    getChildRoutes(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, [
                {
                    path: 'Index',
                    component: require('../pages/Index').default
                },
                {
                    path: 'ProductList',
                    component: require('../pages/ProductList').default
                },
                {
                    path: 'Login',
                    component: require('../pages/Login').default
                }
            ])
        })
    },
    getIndexRoute(nextState, callback) {
        require.ensure([], require => {
            callback(null, {
                component: require("../pages/Index").default
            })
        })
    }
}
