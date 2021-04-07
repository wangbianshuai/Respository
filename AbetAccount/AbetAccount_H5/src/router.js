import React from 'react';
import { router } from 'dva';
import { EnvConfig } from 'Configs';
import Login from './routes/login';

const { Router, Route, Switch } = router;
const wetRootPath = EnvConfig.getServiceUrl('WebRootPath')();

const getPath = (path) => (wetRootPath + path);

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path={[getPath("/login.html")]} exact component={(props) => <Login {...props} app={app} />} />
       </Switch>
    </Router>
  );
}

export default RouterConfig;
