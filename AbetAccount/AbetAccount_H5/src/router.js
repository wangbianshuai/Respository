import React from 'react';
import { router } from 'dva';
import { EnvConfig } from 'Configs';
import Index from './routes/index';

const { Router, Route, Switch } = router;
const wetRootPath = EnvConfig.getServiceUrl('WebRootPath')();

const getPath = (path) => (wetRootPath + path);

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path={[getPath("/"), getPath("/index.html")]} exact component={(props) => <Index {...props} app={app} />} />
       </Switch>
    </Router>
  );
}

export default RouterConfig;
