import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './scanNavi.scss'

export default class NaviClass extends Component {

  // eslint-disable-next-line react/sort-comp
  config = {
    navigationBarTitleText: '相机权限',
    navigationBarBackgroundColor: '#eee',
  }

  constructor(props) {
    super(props);
    this.state = {
      scanLab: '还没扫码',
      tempFilePaths: [],
    }
    this.startScan = this.startScan.bind(this);
    this.photoFunc = this.photoFunc.bind(this);
    this.selectImageFucn = this.selectImageFucn.bind(this);
    // this.addElements = this.addElements.bind(this);
    // this.addEle = this.addEle.bind(this);
  }

  startScan() {
    const scanThis = this;
    Taro.scanCode({
      success(res) {
        console.log(res)
        scanThis.setState({
          scanLab: res.result
        })
      }
    })
  }

  photoFunc() {
    Taro.navigateTo({
      url: '../takePhoto/PhotosPage',
    })
  }
  error(e) {
    console.log(e.detail)
  }

  selectImageFucn() {
    const localThis = this;
    Taro.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        localThis.setState({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  }

  addElements(values) {
    console.log('iageValues', values);
    if (values) {
      return values.map((value) => {
        return <Image className='imageStyle' key={value} mode='scaleToFill' src={value}></Image>
      })
    }

  }

  render() {
    console.log('tempFilePaths', this.state.tempFilePaths);
    return (
      <View>
        <AtButton className='AtButton1' type='primary' onClick={this.startScan}>扫描二维码</AtButton>
        <AtButton className='AtButton' type='primary' onClick={this.photoFunc}>拍照</AtButton>
        <AtButton className='AtButton' type='primary' onClick={this.selectImageFucn}>打开相册</AtButton>
        <AtButton disabled className='scanResult'>{this.state.scanLab}</AtButton >
        {this.addElements(this.state.tempFilePaths)}
      </View>
    )
  }
}
