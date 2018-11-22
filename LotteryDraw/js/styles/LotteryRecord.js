import { StyleSheet } from 'react-native'
import * as ReactNative from "../utils/ReactNative"

const wh = ReactNative.GetWindowSize()

const titleImageHeight = Math.floor(wh.width * 539 / 750)

const recordTitleImageWidth = Math.floor(wh.width * 690 / 750)
const recordTitleImageHeight = Math.floor(recordTitleImageWidth * 163 / 690)

const viewBottomImageWidth = Math.floor(wh.width * 690 / 750)
const viewBottomImageHeight = Math.floor(viewBottomImageWidth * 39 / 690)


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
    ViewType: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TextView1: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    view1text1: {
        marginRight: 35,
        fontFamily: "微软雅黑,Microsoft YaHei",
        fontSize: 20,
        color: "#fff"
    },
    view1text2: {
        marginTop: 10,
        marginRight: 35,
        fontFamily: "微软雅黑,Microsoft YaHei",
        fontSize: 35,
        color: "#fdd300"
    },
    TextView2: {
        marginRight: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    view2text1: {
        marginTop: 5,
        fontFamily: "微软雅黑,Microsoft YaHei",
        fontSize: 20,
        color: "#fff"
    },
    view2text2: {
        marginTop: 5,
        fontFamily: "微软雅黑,Microsoft YaHei",
        fontSize: 20,
        color: "#fed300"
    },
    ItemListView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ViewRecordTitle: {
        width: recordTitleImageWidth,
        height: recordTitleImageHeight
    },
    RecordTitleImage: {
        width: recordTitleImageWidth,
        height: recordTitleImageHeight
    },
    ViewBottom: {
        width: viewBottomImageWidth,
        height: viewBottomImageHeight
    },
    ViewBottomImage: {
        width: viewBottomImageWidth,
        height: viewBottomImageHeight
    },
    itemViewTouch: {
        width: viewBottomImageWidth,
        height: 90,
        backgroundColor: "#fff",
        borderTopColor: "#9fd7e9",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: ReactNative.GetBorderWidth()
    },
    itemView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center'
    },
    itemImage: {
        width: 80,
        height: 80,
        flex: 2,
        borderRadius: 50,
        marginLeft: 20,
        marginRight: 20
    },
    itemText: {
        fontFamily: "微软雅黑,Microsoft YaHei",
        fontSize: 30,
        flex: 4
    },
    itemText2: {
        fontFamily: "微软雅黑,Microsoft YaHei",
        fontSize: 15,
        color: "#fb5689",
        marginRight: 20,
        flex: 1
    }
})
