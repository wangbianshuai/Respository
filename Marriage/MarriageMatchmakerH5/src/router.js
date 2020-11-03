import React from 'react';
import { router } from 'dva';
import MarriageUserLayout from './layouts/marriageUserLayout';
import MatchmakerLayout from './layouts/matchmakerLayout';

const { Router, Route, Switch } = router;

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={(props) => <MarriageUserLayout {...props} app={app} />} />
        <Route path="/user/:name" render={props => <MarriageUserLayout {...props} app={app} />} />
        <Route path="/matchmaker/:name" render={props => <MatchmakerLayout {...props} app={app} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
