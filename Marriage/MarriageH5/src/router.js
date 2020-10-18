import React from 'react';
import { router } from 'dva';
import HomeLayout from './layouts/homeLayout';
import MineLayout from './layouts/mineLayout';
import DetailLayout from './layouts/detailLayout';
import FileIndex from './routes/file/index';

const { Router, Route, Switch } = router;

function RouterConfig({ history, app }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={(props) => <HomeLayout {...props} app={app} />} />
        <Route path="/home/index" render={props => <HomeLayout {...props} app={app} />} />
        <Route path="/footmark/index" render={props => <HomeLayout {...props} app={app} />} />
        <Route path="/gift/index" render={props => <MineLayout {...props} app={app} />} />
        <Route path="/integral/:name" render={props => <MineLayout {...props} app={app} />} />
        <Route path="/mine/index" render={props => <MineLayout {...props} app={app} />} />
        <Route path="/detail/:name" render={props => <DetailLayout {...props} app={app} />} />
        <Route path="/news/:name" render={props => <HomeLayout {...props} app={app} />} />
        <Route path="/library/:name" render={props => <HomeLayout {...props} app={app} />} />
        <Route path="/spectral/:name" render={props => <HomeLayout {...props} app={app} />} />
        <Route path="/chance/:name" render={props => <HomeLayout {...props} app={app} />} />
        <Route path="/user/:name" render={props => <HomeLayout {...props} app={app} />} />
        <Route path="/file/index" exact component={(props) => <FileIndex app={app} {...props} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
