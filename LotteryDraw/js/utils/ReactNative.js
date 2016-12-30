import {
    Platform,
    PixelRatio,
    BackAndroid,
    Alert
} from 'react-native'
import Dimensions from 'Dimensions'

export function GetWindowSize() {
    return Dimensions.get('window')
}

export function IsAndroid() {
    return Platform.OS === "android"
}

export function IsIOS() {
    return Platform.OS === "ios"
}

export function AddBackPress(fn) {
    IsAndroid() && BackAndroid.addEventListener('hardwareBackPress', fn)
}

export function RemoveBackPress() {
    IsAndroid() && BackAndroid.hardwareBackPress('hardwareBackPress', fn)
}

export function GetBorderWidth(width = 1) {
    width = width * (IsIOS() ? 1.0 : 1.5)
    return width / PixelRatio.get()
}

export function alert(message) {
    return new Promise((resolve, reject) => {
        Alert.alert("提示信息", message, [
            { text: '确定', onPress: () => resolve() }
        ])
    })
}

export function confirm(message) {
    return new Promise((resolve, reject) => {
        Alert.alert("确认信息", message, [
            { text: '取消' },
            { text: '确定', onPress: () => resolve() }
        ])
    })
}