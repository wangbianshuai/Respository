import React from 'react';
import { router } from 'dva';
import MarriageUserLayout from './layouts/marriageUserLayout';
import Index from './routes/index';

const { Router, Route, Switch } = router;

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={(props) => <Index {...props} app={app} />} />
        <Route path="/marriage/:name" render={props => <MarriageUserLayout {...props} app={app} />} />
        <Route path="/square/:name" render={props => <MarriageUserLayout {...props} app={app} />} />
        <Route path="/mine/:name" render={props => <MarriageUserLayout {...props} app={app} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
