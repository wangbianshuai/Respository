import React from 'react';
import { router } from 'dva';
import { EnvConfig } from 'Configs';
import Index from './routes/index';
import MyGame from './routes/myGame';
import PostLayout from './layouts/postLayout';
import UserCenter from './routes/userCenter';
import UserInfo from './routes/userInfo';

const { Router, Route, Switch } = router;
const wetRootPath = EnvConfig.getServiceUrl('WebRootPath')();

const getPath = (path) => (wetRootPath + path);

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path={[getPath("/"), getPath("/index.html")]} exact component={(props) => <Index {...props} app={app} />} />
        <Route path={getPath("/myGame.html")} exact component={(props) => <MyGame {...props} app={app} />} />
        <Route path={getPath("/userCenter.html")} exact component={(props) => <UserCenter {...props} app={app} />} />
        <Route path={getPath("/userInfo.html")} exact component={(props) => <UserInfo {...props} app={app} />} />
        <Route path={[getPath('/postList.html'), getPath('/postDetail.html')]} exact component={(props) => <PostLayout {...props} app={app} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
