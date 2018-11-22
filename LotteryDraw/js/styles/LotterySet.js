import { StyleSheet } from 'react-native'
import * as ReactNative from "../utils/ReactNative"

const wh = ReactNative.GetWindowSize()

const titleImageHeight = Math.floor(wh.width * 539 / 750)

const button1Width = Math.floor(wh.width * 329 / 750)
const button1Height = Math.floor(button1Width * 103 / 329)

const selectImageWidth = Math.floor(wh.width * 690 / 750)
const selectImageHeight = Math.floor(selectImageWidth * 186 / 690)

const rectImageHeight = Math.floor(selectImageWidth * 152 / 690)

const button3ImageWidth = Math.floor(wh.width * 339 / 750)
const button3ImageHeight = Math.floor(button3ImageWidth * 112 / 339)

const button4ImageWidth = Math.floor(wh.width * 239 / 750)
const button4ImageHeight = Math.floor(button4ImageWidth * 112 / 239)

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9fd7e9'
    },
    titleView: {
        width: wh.width,
        height: titleImageHeight + button1Height - 12,
        overflow: "hidden"
    },
    titleImage: {
        width: wh.width,
        height: titleImageHeight
    },
    button1View: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: "relative",
        top: -12
    },
    button1Image1: {
        width: button1Width,
        height: button1Height,
        marginLeft: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button1Image2: {
        width: button1Width,
        height: button1Height,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button1Text: {
        fontFamily: "微软雅黑,Microsoft YaHei",
        fontSize: 17,
        color: "#fff"
    },
    button1: {
        width: button1Width,
        height: button1Height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectView: {
        width: wh.width,
        height: selectImageHeight * 2,
        marginTop: 10,
        flexDirection: "column",
        alignItems: 'center'
    },
    cupView: {
        width: selectImageWidth,
        height: selectImageHeight
    },
    selectImage: {
        width: selectImageWidth,
        height: selectImageHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pickerView: {
        width: selectImageWidth - 50,
        height: selectImageHeight / 2,
        marginLeft: 50,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    pickerText: {
        fontSize: 25,
        color: "#ff7a06",
        fontFamily: "微软雅黑,Microsoft YaHei",
        marginLeft: 20
    },
    selectPicker: {
        width: 210
    },
    bottomView: {
        width: wh.width,
        height: rectImageHeight,
        marginTop: 8
    },
    rectImage: {
        flexDirection: "row",
        width: wh.width,
        height: rectImageHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textCountView: {
        width: 75,
        height: rectImageHeight,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center'
    },
    textCount1: {
        fontSize: 15,
        color: "#b8e1ed",
        fontFamily: "微软雅黑,Microsoft YaHei",
    },
    textCount2: {
        fontSize: 20,
        color: "#fff",
        fontFamily: "微软雅黑,Microsoft YaHei",
    },
    imageView2: {
        flexDirection: "row",
        width: wh.width - 75,
        height: rectImageHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button3Image: {
        width: button3ImageWidth,
        height: button3ImageHeight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    button3: {
        width: button3ImageWidth,
        height: button3ImageHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button3text: {
        fontSize: 22,
        color: "#ffd766",
        fontFamily: "微软雅黑,Microsoft YaHei",
    },
    button4Image: {
        width: button4ImageWidth,
        height: button4ImageHeight,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    button4: {
        width: button4ImageWidth,
        height: button4ImageHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button4text: {
        fontSize: 17,
        color: "#fff",
        fontFamily: "微软雅黑,Microsoft YaHei",
    }
})
