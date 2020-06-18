import React from "react";
import LeftRightLayout from './leftRightLayout/index';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale/zh_CN';
import { Provider } from "react-redux";

const isLogin = (props) => {
  const { location: { pathname } } = props;
  let name = pathname.toLowerCase().replace(".html", "");
  return name === '/login';
}

const renderPage = (props) => {
  if (isLogin(props)) return props.children;

  return <LeftRightLayout {...props} />
}

export default (props) => {
  return (
    <ConfigProvider locale={zh_CN}>
      <Provider store={window.g_app._store}>
        {renderPage(props)}
      </Provider>
    </ConfigProvider>
  )
}
