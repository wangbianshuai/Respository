import React from 'react';
import { router } from 'dva';
import HomeLayout from './layouts/homeLayout';

const { Router, Route, Switch } = router;

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={(props) => <HomeLayout {...props} app={app} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
