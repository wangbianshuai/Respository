import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/Index';

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={() => <IndexPage App={app} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
