import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';
import Login from './pages/login';
import dva from './dva';

import './app.scss';

const store = dva._store;

class App extends Component {
  config = {
    pages: [
      'pages/index',
      'pages/login',
      'pages/work/dailyInput',
      'pages/work/dailyList',
      'pages/config/storyList',
      'pages/config/weekList',
      'pages/index/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
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
