import { StyleSheet } from 'react-native'
import { GetBorderWidth } from "../utils/ReactNative"

export default StyleSheet.create({
    view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        backgroundColor: "#eeeeee",
        borderBottomColor: '#000000',
        borderBottomWidth: GetBorderWidth()
    },
    backButton: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        borderRightColor: "#000000",
        borderRightWidth: GetBorderWidth()
    },
    back: {
        fontSize: 16,
        width: 50,
        color: "#000000",
        textAlign: 'center'
    },
    titleView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20
    },
    rightButton: {
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    right: {
        width: 50,
        fontSize: 16,
        textAlign: "right",
        color: "#000000",
    }
})
