import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createHistory } from 'history'
import createStore from './store/Index'
import Root from './Root'

export default class Index extends Component {
    constructor() {
        super()

        this.state = {
            isLoading: true,
            store: createStore(() => { this.setState({ isLoading: false }) })
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

render(<Index />, document.getElementById("divContainer"))