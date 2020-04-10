import Taro, { Component } from '@tarojs/taro'

import { View, Image } from '@tarojs/components'
import { AtList, AtListItem, AtButton } from "taro-ui"

import './userInfo.scss';
import headerIcom from './assets/defaultHeader.jpg';

class UserLogin extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     nickName: 'xxx',
  //     avatarUrl: '',
  //   }
  //   this.tobegin = this.tobegin.bind(this);
  // }

  state = {
    nickName: 'xxx',
    avatarUrl: '',
    gender: '',
    city:'',
    province: '',
  }

  config = {
    navigationBarTitleText: '个人信息'
  }

  tobegin = () => {
    const tarThis = this;
    Taro.getSetting({}).then(res => {
      if (res.authSetting["scope.userInfo"] === false) {
      }

      if (res.authSetting["scope.userInfo"] === true) {
        Taro.getUserInfo({lang:'zh_CN'}).then(userInfo => {
          const userInfos = JSON.parse(userInfo.rawData);
          tarThis.setState({
            avatarUrl: userInfos.avatarUrl,
            nickName: userInfos.nickName,
            gender: userInfos.gender,
            city: userInfos.city,
            province: userInfos.province,
          });
        }).catch(error => {
          console.log(error)
        })
      }
    })
  }

  render() {
    const { avatarUrl, nickName, gender, city, province } = this.state;
    return (

      <View>
        <View style='text-align: center'>
          <Image className='headerImage' src={avatarUrl?avatarUrl:headerIcom} />
        </View>

        <AtList>
          <AtListItem title='姓名' extraText={nickName} />
          <AtListItem title='性别' extraText={gender === 1?'男':gender === 2?'女':'未知'} />
          <AtListItem title='地址' extraText={province+'/'+city} />
        </AtList>

        <AtButton type='primary' className='container' onClick={this.tobegin}>获取</AtButton>

      </View>

    )

  }

}

export default UserLogin;