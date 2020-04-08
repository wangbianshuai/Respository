import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';
import Login from './pages/login';
import dva from './dva';

import './app.scss';

const store = dva._store;

class App extends Component {
  config = {
    pages: [
      'pages/login',
      'pages/index',
      'pages/work/dailyInput',
      'pages/work/dailyList',
      'pages/config/storyList',
      'pages/config/weekList',
      'pages/index/index',
      'pages/cameraModel/ScanNavi/scanNavi',
      'pages/cameraModel/takePhoto/PhotosPage',
      'pages/kevin/index',
      'pages/kevin/userInfo',
      'pages/kevin/address',
      'pages/kevin/share',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    },
    permission: {
      // 在 app.json 里面增加 permission 属性配置
      'scope.userLocation': {
        desc: '您的位置信息将用于小程序位置接口的效果展示',
      },
    },
  };

  render() {
    return (
      <Provider store={store}>
        <Login />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
