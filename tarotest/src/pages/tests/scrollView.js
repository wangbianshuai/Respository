import Taro, { usePullDownRefresh, useReachBottom } from "@tarojs/taro";
import { View } from '@tarojs/components';


const SrollViewTest = () => {
  usePullDownRefresh(() => {
    console.log('usePullDownRefresh');

  });

  useReachBottom(() => {
    console.log('useReachBottom');
  })

  return (
    <View>
      <View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 1</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 2</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 3</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 4</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 5</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 6</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 7</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 8</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 9</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 10</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 1</View>
        <View style={{ borderBottom: '1PX solid red', height: '80px' }}>test row 2</View>
      </View>
    </View>
  )
}

SrollViewTest.config = {
  navigationBarTitleText: 'SrollView Test',
  enablePullDownRefresh: true,
};


export default SrollViewTest;
