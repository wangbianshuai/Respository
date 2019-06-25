import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';


const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/Auditing/AntiFraudAuditing.html",
        "exact": true,
        "component": require('../Auditing/AntiFraudAuditing.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Auditing/FinalAuditing.html",
        "exact": true,
        "component": require('../Auditing/FinalAuditing.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Auditing/FinalReviewAuditing.html",
        "exact": true,
        "component": require('../Auditing/FinalReviewAuditing.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Auditing/FirstTrialAuditing.html",
        "exact": true,
        "component": require('../Auditing/FirstTrialAuditing.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Auditing/FirstTrialPhoneAuditing.html",
        "exact": true,
        "component": require('../Auditing/FirstTrialPhoneAuditing.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Auditing/IndeedAuditing.html",
        "exact": true,
        "component": require('../Auditing/IndeedAuditing.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Auditing/LoanReviewCommittee.html",
        "exact": true,
        "component": require('../Auditing/LoanReviewCommittee.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Auditing/WaitConditionAuditing.html",
        "exact": true,
        "component": require('../Auditing/WaitConditionAuditing.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/BackMethodConfig.html",
        "exact": true,
        "component": require('../CommonConfig/BackMethodConfig.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/BackMethodEdit.html",
        "exact": true,
        "component": require('../CommonConfig/BackMethodEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/PlatformFineRateEdit.html",
        "exact": true,
        "component": require('../CommonConfig/PlatformFineRateEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/PlatformManageRateEdit.html",
        "exact": true,
        "component": require('../CommonConfig/PlatformManageRateEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/PlatformRateConfig.html",
        "exact": true,
        "component": require('../CommonConfig/PlatformRateConfig.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/PlatformServiceRateEdit.html",
        "exact": true,
        "component": require('../CommonConfig/PlatformServiceRateEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/ProductConfig.html",
        "exact": true,
        "component": require('../CommonConfig/ProductConfig.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/ProductEdit.html",
        "exact": true,
        "component": require('../CommonConfig/ProductEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/ProductRateConfig.html",
        "exact": true,
        "component": require('../CommonConfig/ProductRateConfig.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CommonConfig/ProductRateEdit.html",
        "exact": true,
        "component": require('../CommonConfig/ProductRateEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CreditManage/ApproveResultConfirm.html",
        "exact": true,
        "component": require('../CreditManage/ApproveResultConfirm.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CreditManage/OrderDetail.html",
        "exact": true,
        "component": require('../CreditManage/OrderDetail.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CreditManage/OrderPatchEdit.html",
        "exact": true,
        "component": require('../CreditManage/OrderPatchEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/CreditManage/OrderPatchRecord.html",
        "exact": true,
        "component": require('../CreditManage/OrderPatchRecord.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Customer/BlacklistEdit.html",
        "exact": true,
        "component": require('../Customer/BlacklistEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Customer/BlacklistManage.html",
        "exact": true,
        "component": require('../Customer/BlacklistManage.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Customer/QueryCustomer.html",
        "exact": true,
        "component": require('../Customer/QueryCustomer.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Customer/WebQueryReview.html",
        "exact": true,
        "component": require('../Customer/WebQueryReview.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/index.html",
        "exact": true,
        "component": require('../index.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Login.html",
        "exact": true,
        "component": require('../Login.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Orders/HandledOrderList.html",
        "exact": true,
        "component": require('../Orders/HandledOrderList.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Orders/OrderDetailList.html",
        "exact": true,
        "component": require('../Orders/OrderDetailList.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Orders/OrderList.html",
        "exact": true,
        "component": require('../Orders/OrderList.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Orders/QueryOrderList.html",
        "exact": true,
        "component": require('../Orders/QueryOrderList.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Orders/StatusNodeLogs.html",
        "exact": true,
        "component": require('../Orders/StatusNodeLogs.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Orders/SuspendedOrderList.html",
        "exact": true,
        "component": require('../Orders/SuspendedOrderList.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/Orders/WaitingOrderList.html",
        "exact": true,
        "component": require('../Orders/WaitingOrderList.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/PersonCenter/BaseInfo.html",
        "exact": true,
        "component": require('../PersonCenter/BaseInfo.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/RightManage/RightConfig.html",
        "exact": true,
        "component": require('../RightManage/RightConfig.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/RightManage/RoleConfig.html",
        "exact": true,
        "component": require('../RightManage/RoleConfig.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/RightManage/RoleEdit.html",
        "exact": true,
        "component": require('../RightManage/RoleEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/RightManage/RoleManage.html",
        "exact": true,
        "component": require('../RightManage/RoleManage.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/RightManage/UserEdit.html",
        "exact": true,
        "component": require('../RightManage/UserEdit.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "path": "/RightManage/UserManage.html",
        "exact": true,
        "component": require('../RightManage/UserManage.js').default,
        "_title": "risk",
        "_title_default": "risk"
      },
      {
        "component": () => React.createElement(require('E:/Respository/UmiWeb/node_modules/_umi-build-dev@1.10.4@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false }),
        "_title": "risk",
        "_title_default": "risk"
      }
    ],
    "_title": "risk",
    "_title_default": "risk"
  },
  {
    "component": () => React.createElement(require('E:/Respository/UmiWeb/node_modules/_umi-build-dev@1.10.4@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false }),
    "_title": "risk",
    "_title_default": "risk"
  }
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
history.listen(routeChangeHandler);
routeChangeHandler(history.location);

export { routes };

export default function RouterWrapper(props = {}) {
  return (
<Router history={history}>
      { renderRoutes(routes, props) }
    </Router>
  );
}
