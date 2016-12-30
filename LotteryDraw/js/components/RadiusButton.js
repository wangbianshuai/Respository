import React, { Component, PropTypes } from 'react'
import {
    Text,
    View,
    TouchableHighlight
} from 'react-native'
import styles from "../styles/RadiusButton"

export default class RadiusButton extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        btnName: PropTypes.string,
        textStyle: Text.propTypes.style,
        btnStyle: TouchableHighlight.propTypes.style,
        underlayColor: TouchableHighlight.propTypes.underlayColor
    }

    static get defaultProps() {
        return {
            text: 'Button',
            underlayColor: '#4169e1',
            textStyle: {},
            buttonnStyle: {},
            onPress: null
        }
    }

    render() {
        return (
            <View style={styles.view}>
                <TouchableHighlight
                    underlayColor={this.props.underlayColor}
                    activeOpacity={0.5}
                    style={[styles.center, styles.buttonDefault, this.props.buttonStyle]}
                    onPress={this.props.onPress}>
                    <Text style={[styles.textDefault, this.props.textStyle]}>{this.props.text}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

