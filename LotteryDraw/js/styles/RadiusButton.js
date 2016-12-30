import { StyleSheet } from 'react-native'
import { GetBorderWidth } from "../utils/ReactNative"

export default StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonDefault: {
        width: 100,
        height: 20,
        backgroundColor: '#ff8447',
        borderColor: '#ff8447',
        borderRadius: 15,
        borderWidth: GetBorderWidth()
    },
    textDefault: {
        fontSize: 16,
        color: '#ffffff'
    },
    view: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
