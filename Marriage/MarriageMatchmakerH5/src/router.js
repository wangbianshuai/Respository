import React from 'react';
import { router } from 'dva';
import MatchmakerLayout from './layouts/matchmakerLayout';
import Index from './routes/index';

const { Router, Route, Switch } = router;

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={(props) => <Index {...props} app={app} />} />
        <Route path="/boygirl/:name" render={props => <MatchmakerLayout {...props} app={app} />} />
        <Route path="/marriage/:name" render={props => <MatchmakerLayout {...props} app={app} />} />
        <Route path="/mine/:name" render={props => <MatchmakerLayout {...props} app={app} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
