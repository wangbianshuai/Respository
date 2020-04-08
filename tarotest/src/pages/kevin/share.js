import Taro, { Component } from '@tarojs/taro'
// 引入对应的组件
import { View, Text, Button, Canvas } from '@tarojs/components'
import './share.scss'

export default class Index extends Component {
  /**
  * 初始化信息
  */
  constructor() {
    this.state = {
      // 用户信息
      userInfo: {},
      // 是否展示canvas
      isShowCanvas: false
    }
  }

  config = {
    navigationBarTitleText: '首页'
  }

  /**
  * getUserInfo() 获取用户信息
  */
  getUserInfo(e) {
    if (!e.detail.userInfo) {
      Taro.showToast({
        title: '获取用户信息失败，请授权',
        icon: 'none'
      })
      return
    }
    this.setState({
      isShowCanvas: true,
      userInfo: e.detail.userInfo
    }, () => {
      // 调用绘制图片方法
      this.drawImage()
    })
  }

  /**
  * drawImage() 定义绘制图片的方法
  */
  async drawImage() {
    // 创建canvas对象
    let ctx = Taro.createCanvasContext('cardCanvas')

    // 填充背景色
    let grd = ctx.createLinearGradient(0, 0, 1, 500)
    grd.addColorStop(0, '#1452d0')
    grd.addColorStop(0.5, '#FFF')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, 0, 400, 500)

    // // 绘制圆形用户头像
    let { userInfo } = this.state
    let res = await Taro.downloadFile({
      url: userInfo.avatarUrl
    })
    ctx.save()
    ctx.beginPath()
    // ctx.arc(160, 86, 66, 0, Math.PI * 2, false)
    ctx.arc(160, 88, 66, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.stroke()
    ctx.translate(160, 88)
    ctx.drawImage(res.tempFilePath, -66, -66, 132, 132)
    ctx.restore()

    // 绘制文字
    ctx.save()
    ctx.setFontSize(20)
    ctx.setFillStyle('#FFF')
    ctx.fillText(userInfo.nickName, 140, 200)
    ctx.setFontSize(16)
    ctx.setFillStyle('black')
    ctx.fillText('自动生成的图片', 100, 240)
    ctx.restore()

    // 绘制二维码
    let qrcode = await Taro.downloadFile({
      url: 'https://upload-images.jianshu.io/upload_images/3091895-f0b4b900390aec73.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/258/format/webp.jpg'
    })
    ctx.drawImage(qrcode.tempFilePath, 70, 260, 180, 180)

    // 将以上绘画操作进行渲染
    ctx.draw()
  }

  /**
  * saveCard() 保存图片到本地
  */
  async saveCard() {
    // 将Canvas图片内容导出指定大小的图片
    let res = await Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 400,
      height: 500,
      destWidth: 360,
      destHeight: 450,
      canvasId: 'cardCanvas',
      fileType: 'png'
    })
    let saveRes = await Taro.saveImageToPhotosAlbum({
      filePath: res.tempFilePath
    })
    if (saveRes.errMsg === 'saveImageToPhotosAlbum:ok') {
      Taro.showModal({
        title: '图片保存成功',
        content: '图片成功保存到相册了，快去发朋友圈吧~',
        showCancel: false,
        confirmText: '确认'
      })
    } else {
      Taro.showModal({
        title: '图片保存失败',
        content: '请重新尝试!',
        showCancel: false,
        confirmText: '确认'
      })
    }
  }

  render() {
    let { isShowCanvas } = this.state
    return (
      <View style='height: 100%'>
        <View className='index'>
          <Text>1.小程序分享：分享当前页面。\n2.图片分享：生成一张图片，保存到自己的相册，才可以分享。</Text>
        </View>
        <View className='index'>
          <Button openType='share' type='primary' size='mini'>小程序分享</Button>
          <Button onGetUserInfo={this.getUserInfo} openType='getUserInfo' type='primary' size='mini'>图片分享</Button>
          {/* 使用Canvas绘制分享图片 */}
          {
            isShowCanvas &&
            <View className='canvas-wrap'>
              <Canvas
                id='card-canvas'
                className='card-canvas'
                style='width: 320px; height: 450px'
                canvasId='cardCanvas'
              >
              </Canvas>
              <Button onClick={this.saveCard} className='btn-save' type='primary' size='mini'>保存到相册</Button>
            </View>
          }
        </View>
      </View>
    )
  }
}