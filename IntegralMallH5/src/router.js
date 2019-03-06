import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider } from 'antd-mobile';
import HomePage from "./routes/HomePage"
import MyCredit from "./routes/MyCredit"
import CreditRule from "./routes/CreditRule"
import ExchangeRecord from "./routes/ExchangeRecord"
import ExchangeDetail from "./routes/ExchangeDetail"
import AllProducts from "./routes/AllProducts"
import Product from "./routes/Product"
import Test from "./routes/Test";
import ProductExchange from "./routes/ProductExchange"
import ProductExchangeResult from "./routes/ProductExchangeResult";

function RouterConfig({ history, app }) {
  return (
    <LocaleProvider>
      <Router history={history}>
        <Switch>
          <Route path="/HomePage" exact component={() => <HomePage App={app} />} />
          <Route path="/MyCredit" exact component={() => <MyCredit App={app} />} />
          <Route path="/CreditRule" exact component={() => <CreditRule App={app} />} />
          <Route path="/AllProducts" exact component={() => <AllProducts App={app} />} />
          <Route path="/ExchangeRecord" exact component={() => <ExchangeRecord App={app} />} />
          <Route path="/ExchangeDetail" exact component={() => <ExchangeDetail App={app} />} />
          <Route path="/Product" exact component={() => <Product App={app} />} />
          <Route path="/Test" exact component={() => <Test App={app} />} />
          <Route path="/ProductExchange" exact component={() => <ProductExchange App={app} />} />
          <Route path="/ProductExchangeResult" exact component={() => <ProductExchangeResult App={app} />} />

          <Redirect exact from="/" to="/HomePage" />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
