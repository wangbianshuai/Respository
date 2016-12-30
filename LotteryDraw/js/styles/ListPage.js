import { StyleSheet } from 'react-native'
import * as ReactNative from "../utils/ReactNative"

const wh = ReactNative.GetWindowSize()

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
        flexDirection: "column"
    },
    itemViewTouch: {
        width: wh.width,
        height: 70,
        marginTop: 5,
        backgroundColor: "#fff",
    },
    itemView: {
        width: wh.width,
        height: 70,
        alignItems: "center",
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginLeft: 20
    },
    itemText: {
        marginLeft: 20,
        fontSize: 14
    }
})
