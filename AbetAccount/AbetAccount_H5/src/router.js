import React from 'react';
import { router } from 'dva';
import { EnvConfig } from 'Configs';
import Login from './routes/login';
import AccountBillLayout from './layouts/accountBillLayout';
import AccountCategoryLayout from './layouts/accountCategoryLayout';
import AccountItemLayout from './layouts/accountItemLayout';
import UserInfoLayout from './layouts/userInfoLayout';
import AccountBillCountLayout from './layouts/accountBillCountLayout';

const { Router, Route, Switch } = router;
const wetRootPath = EnvConfig.getServiceUrl('WebRootPath')();

const getPath = (path) => (wetRootPath + path);

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path={[getPath("/login.html")]} exact component={(props) => <Login {...props} app={app} />} />
        <Route path={[getPath('/accountBillList.html'), getPath('/accountBillEdit.html')]} exact component={(props) => <AccountBillLayout {...props} app={app} />} />
        <Route path={[getPath('/accountBillCount.html')]} exact component={(props) => <AccountBillCountLayout {...props} app={app} />} />
        <Route path={[getPath('/accountCategoryList.html'), getPath('/accountCategoryEdit.html')]} exact component={(props) => <AccountCategoryLayout {...props} app={app} />} />
        <Route path={[getPath('/accountItemList.html'), getPath('/accountItemEdit.html')]} exact component={(props) => <AccountItemLayout {...props} app={app} />} />
        <Route path={[getPath('/userInfo.html'), getPath('/changePassword.html')]} exact component={(props) => <UserInfoLayout {...props} app={app} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
