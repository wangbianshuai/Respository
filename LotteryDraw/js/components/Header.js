import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableHighlight
} from 'react-native'
import styles from "../styles/Header"

export default class Header extends Component {
    constructor(props) {
        super(props)
    }

    static get defaultProps() {
        return {
            BackText: "返回",
            RightText: "",
            RightOnPress: () => void (0),
            Title: ""
        }
    }

    BackPress() {
        this.props.Router && this.props.Router.pop()
    }

    render() {
        return (
            <View style={styles.view}>
                <TouchableHighlight style={styles.backButton} underlayColor="#eeeeee" onPress={this.BackPress.bind(this)}>
                    <Text style={styles.back}>{this.props.BackText}</Text></TouchableHighlight>
                <View style={styles.titleView}>
                    <Text style={styles.title}>{this.props.Title}</Text></View>
                <TouchableHighlight style={styles.rightButton}>
                    <Text style={styles.right} underlayColor="#eeeeee" onPress={this.props.RightOnPress.bind(this)}>{this.props.RightText}</Text></TouchableHighlight>
            </View>
        )
    }
}