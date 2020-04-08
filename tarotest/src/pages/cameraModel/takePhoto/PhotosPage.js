import Taro, { Component } from '@tarojs/taro';
import { View, Camera, Image, Button } from '@tarojs/components';
import './photosPage.scss'

export default class photosPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src: [],
    }
    this.takePhoto = this.takePhoto.bind(this);
  }

  // eslint-disable-next-line react/sort-comp
  config = {
    navigationBarTitleText: '拍照',
  }

  componentDidMount() {
    this.ctx = Taro.createCameraContext()
  }

  takePhoto() {
    if (this.state.src.length >= 3) {
      Taro.showModal
    }
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setState({
          src: res.tempImagePath
        })
      }
    })
  }
  error(e) {
    console.log(e.detail)
  }

  render() {
    return (
      <View style='height: 100%;'>
        <View style='height: 100%;'>
          <Camera className='cameraStyle' device-position='back' flash='off' binderror='error'></Camera>
          <View>
            <Button className='confirmBtn' onClick={this.takePhoto}>拍照</Button>
          </View>
          <Image mode='scaleToFill' className='ReviewImage' src={this.state.src}></Image>
        </View>
      </View>
    )
  }
}
