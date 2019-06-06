import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/CreditManage/OrderPatchRecord.html",
        "exact": true,
        "component": require('../CreditManage/OrderPatchRecord.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Auditing/AntiFraudAuditing.html",
        "exact": true,
        "component": require('../Auditing/AntiFraudAuditing.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Auditing/FinalReviewAuditing.html",
        "exact": true,
        "component": require('../Auditing/FinalReviewAuditing.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Auditing/FirstTrialAuditing.html",
        "exact": true,
        "component": require('../Auditing/FirstTrialAuditing.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Auditing/FirstTrialPhoneAuditing.html",
        "exact": true,
        "component": require('../Auditing/FirstTrialPhoneAuditing.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Auditing/IndeedAuditing.html",
        "exact": true,
        "component": require('../Auditing/IndeedAuditing.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Auditing/LoanReviewCommittee.html",
        "exact": true,
        "component": require('../Auditing/LoanReviewCommittee.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Auditing/WaitConditionAuditing.html",
        "exact": true,
        "component": require('../Auditing/WaitConditionAuditing.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/BackMethodConfig.html",
        "exact": true,
        "component": require('../CommonConfig/BackMethodConfig.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/BackMethodEdit.html",
        "exact": true,
        "component": require('../CommonConfig/BackMethodEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/PlatformFineRateEdit.html",
        "exact": true,
        "component": require('../CommonConfig/PlatformFineRateEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/PlatformManageRateEdit.html",
        "exact": true,
        "component": require('../CommonConfig/PlatformManageRateEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/PlatformRateConfig.html",
        "exact": true,
        "component": require('../CommonConfig/PlatformRateConfig.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/PlatformServiceRateEdit.html",
        "exact": true,
        "component": require('../CommonConfig/PlatformServiceRateEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/ProductConfig.html",
        "exact": true,
        "component": require('../CommonConfig/ProductConfig.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/ProductEdit.html",
        "exact": true,
        "component": require('../CommonConfig/ProductEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/ProductRateConfig.html",
        "exact": true,
        "component": require('../CommonConfig/ProductRateConfig.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CommonConfig/ProductRateEdit.html",
        "exact": true,
        "component": require('../CommonConfig/ProductRateEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CreditManage/ApproveResultConfirm.html",
        "exact": true,
        "component": require('../CreditManage/ApproveResultConfirm.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CreditManage/OrderDetail.html",
        "exact": true,
        "component": require('../CreditManage/OrderDetail.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/CreditManage/OrderPatchEdit.html",
        "exact": true,
        "component": require('../CreditManage/OrderPatchEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Auditing/FinalAuditing.html",
        "exact": true,
        "component": require('../Auditing/FinalAuditing.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Customer/BlacklistEdit.html",
        "exact": true,
        "component": require('../Customer/BlacklistEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Customer/BlacklistManage.html",
        "exact": true,
        "component": require('../Customer/BlacklistManage.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Customer/QueryCustomer.html",
        "exact": true,
        "component": require('../Customer/QueryCustomer.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Customer/WebQueryReview.html",
        "exact": true,
        "component": require('../Customer/WebQueryReview.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Login.html",
        "exact": true,
        "component": require('../Login.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Orders/HandledOrderList.html",
        "exact": true,
        "component": require('../Orders/HandledOrderList.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Orders/OrderDetailList.html",
        "exact": true,
        "component": require('../Orders/OrderDetailList.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Orders/OrderList.html",
        "exact": true,
        "component": require('../Orders/OrderList.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Orders/QueryOrderList.html",
        "exact": true,
        "component": require('../Orders/QueryOrderList.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Orders/StatusNodeLogs.html",
        "exact": true,
        "component": require('../Orders/StatusNodeLogs.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Orders/SuspendedOrderList.html",
        "exact": true,
        "component": require('../Orders/SuspendedOrderList.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/Orders/WaitingOrderList.html",
        "exact": true,
        "component": require('../Orders/WaitingOrderList.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/PersonCenter/BaseInfo.html",
        "exact": true,
        "component": require('../PersonCenter/BaseInfo.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/RightManage/RightConfig.html",
        "exact": true,
        "component": require('../RightManage/RightConfig.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/RightManage/RoleConfig.html",
        "exact": true,
        "component": require('../RightManage/RoleConfig.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/RightManage/RoleEdit.html",
        "exact": true,
        "component": require('../RightManage/RoleEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/RightManage/RoleManage.html",
        "exact": true,
        "component": require('../RightManage/RoleManage.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/RightManage/UserEdit.html",
        "exact": true,
        "component": require('../RightManage/UserEdit.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/RightManage/UserManage.html",
        "exact": true,
        "component": require('../RightManage/UserManage.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/index.html",
        "exact": true,
        "component": require('../index.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default,
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      },
      {
        "component": () => React.createElement(require('/Users/wangbianzhai/Desktop/work/risk/node_modules/_umi-build-dev@1.8.0@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false }),
        "_title": "风控审批系统",
        "_title_default": "风控审批系统"
      }
    ],
    "_title": "风控审批系统",
    "_title_default": "风控审批系统"
  },
  {
    "component": () => React.createElement(require('/Users/wangbianzhai/Desktop/work/risk/node_modules/_umi-build-dev@1.8.0@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false }),
    "_title": "风控审批系统",
    "_title_default": "风控审批系统"
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
