import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from './store/Index'
import Root from './root'

configureStore()

export default class App extends Component {
    constructor() {
        super()

        this.state = {
            isLoading: true,
            store: configureStore(() => { this.setState({ isLoading: false }) })
        }
    }
    render() {
        if (this.state.isLoading) {
            return null;
        }
        return (
            <Provider store={this.state.store}>
                <Root />
            </Provider>
        )
    }
}