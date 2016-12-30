import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Text,
    View
} from 'react-native'
import styles from '../styles/Index'
import RadiusButton from "../components/RadiusButton"

class Index extends Component {

    onPressClick() {
        this.props.Router.push("LotterySet")
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    欢迎您，祝您好运！
        </Text>
                <RadiusButton
                    text="抽奖"
                    textStyle={styles.buttonText}
                    buttonStyle={styles.button}
                    underlayColor='#4169e1'
                    onPress={this.onPressClick.bind(this)} >
                    ></RadiusButton>
            </View>
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