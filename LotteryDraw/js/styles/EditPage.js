import { StyleSheet } from 'react-native'
import * as ReactNative from "../utils/ReactNative"

const wh = ReactNative.GetWindowSize()
const borderWidth = ReactNative.GetBorderWidth()

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
        flexDirection: "column"
    },
    editView: {
        width: wh.width,
        height: 60,
        marginTop: 5,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"

    },
    labelText: {
        flex: 1,
        fontSize: 14,
        marginLeft: 20,
        color: "#aaa"
    },
    textInput: {
        flex: 4,
        fontSize: 14,
        marginRight: 5,
        paddingLeft: 5
    },
    switchView: {
        width: wh.width,
        height: 60,
        marginTop: 5,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    switch: {
        flex: 4,
        marginRight: 10
    },
    pickerView: {
        flex: 4,
        marginRight: 5,
    },
    selectPicker: {
        flex: 1
    }
})
