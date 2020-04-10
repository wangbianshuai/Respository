import Taro, { useCallback } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import './index.scss';

const Index = () => {
  const toLogin = useCallback(() => {
    Taro.redirectTo({
      url: '/pages/login'
    })
  }, []);

  const toUserInfo = useCallback(() => {
    Taro.redirectTo({
      url: '/pages/kevin/index'
    })
  }, []);

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <View style={{ textAlign: 'center' }}><Button size='mini' type='primary' onClick={toLogin}>登录</Button></View>
      <View style={{ textAlign: 'center' }}><Button size='mini' type='primary' onClick={toUserInfo}>kevin</Button></View>
    </View>
  )
};

Index.config = {
  navigationBarTitleText: '首页'
};

export default Index;
