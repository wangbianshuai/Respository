import { StyleSheet } from 'react-native'
import * as ReactNative from "../utils/ReactNative"

const wh = ReactNative.GetWindowSize()

const titleImageHeight = Math.floor(wh.width * 717 / 750)

const button3ImageWidth = Math.floor(wh.width * 339 / 750)
const button3ImageHeight = Math.floor(button3ImageWidth * 112 / 339)

const typeViewImageWidth = Math.floor(wh.width * 640 / 750)
const typeViewImageHeight = Math.floor(typeViewImageWidth * 252 / 640)


export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9fd7e9'
    },
    titleView: {
        width: wh.width,
        height: titleImageHeight
    },
    titleImage: {
        width: wh.width,
        height: titleImageHeight
    },
    UserView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userViewText: {
        fontFamily: "微软雅黑,Microsoft YaHei",
        fontSize: 50,
        color: "#fff",
        fontWeight: "700",
        marginRight: 35,
        marginTop: 35
    },
    DrawView: {
        position: "relative",
        top: -20,
        height: 85,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    ImageView2: {
        width: button3ImageWidth,
        height: button3ImageHeight
    },
    Button3Image: {
        width: button3ImageWidth,
        height: button3ImageHeight,
        justifyContent: 'center',
        alignItems: "center"
    },
    button3: {
        width: button3ImageWidth,
        height: button3ImageHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Button3Text: {
        fontSize: 22,
        color: "#ffda5f",
        fontFamily: "微软雅黑,Microsoft YaHei"
    },
    ViewTime: {
        position: "relative",
        top: -10,
    },
    TimeText: {
        fontSize: 75,
        color: "#fed300",
        fontFamily: "微软雅黑,Microsoft YaHei",
        fontWeight: "700"
    },
    ViewType: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    ViewTypeView: {
        width: typeViewImageWidth,
        height: typeViewImageHeight
    },
    ViewTypeViewImage: {
        width: typeViewImageWidth,
        height: typeViewImageHeight,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextView1: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TextView1text1: {
        fontSize: 25,
        color: "#fdd300",
        fontFamily: "微软雅黑,Microsoft YaHei"
    },
    TextView1text2: {
        fontSize: 35,
        color: "#fff",
        fontFamily: "微软雅黑,Microsoft YaHei"
    },
    TextView2: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    TextView3: {
        flexDirection: 'row'
    },
    TextView3text1: {
        fontSize: 20,
        color: "#fff",
        fontFamily: "微软雅黑,Microsoft YaHei"
    },
    TextView3text2: {
        fontSize: 20,
        color: "#fed300",
        fontFamily: "微软雅黑,Microsoft YaHei"
    }
})
