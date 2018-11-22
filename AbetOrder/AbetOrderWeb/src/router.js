import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import LeftRightLayout from "./layouts/LeftRightLayout"
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Login from "./routes/Login"

function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/Login" exact component={() => <Login App={app} />} />
          <Route path="/:name" render={props => <LeftRightLayout {...props} App={app} />} />
          <Redirect exact from="/" to="/Login" />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
