import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import LeftRightLayout from "./layouts/LeftRightLayout"
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/:name" render={props => <LeftRightLayout {...props} App={app} />} />
          <Redirect exact from="/" to="/ContentChannel" />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
