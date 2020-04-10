import Taro, { useCallback } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton, AtMessage } from 'taro-ui'

import './index.scss';

const Index = () => {
  const toAddress = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/kevin/address'
    })
  }, []);

  const toPay = useCallback((type) => {
    Taro.atMessage({
      'message': '小程序个人账号无法接入支付功能',
      'type': type,
    })
  }, []);

  const toUserInfo = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/kevin/userInfo'
    })
  }, []);

  const toShare = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/kevin/share'
    })
  }, []);

  return (
    <View className='at-row at-row--wrap'>
      <AtMessage />
      <View className='at-col at-col-12'>
        <AtButton type='primary' className='container' onClick={toUserInfo}>获取用户信息</AtButton>
      </View>
      <View className='at-col at-col-12'>
        <AtButton type='primary' className='container' onClick={toPay}>支付</AtButton>
      </View>
      <View className='at-col at-col-12'>
        <AtButton type='primary' className='container' onClick={toAddress}>获取地址</AtButton>
      </View>
      <View className='at-col at-col-12'>
        <AtButton type='primary' className='container' onClick={toShare}>分享</AtButton>
      </View>
    </View>
  )
};

Index.config = {
  navigationBarTitleText: '功能列表'
};

export default Index;