import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'Approval', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Approval.js').default) });
app.model({ namespace: 'BackMethod', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/BackMethod.js').default) });
app.model({ namespace: 'Blacklist', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Blacklist.js').default) });
app.model({ namespace: 'Contact', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Contact.js').default) });
app.model({ namespace: 'Credit', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Credit.js').default) });
app.model({ namespace: 'Employee', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Employee.js').default) });
app.model({ namespace: 'Finance', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Finance.js').default) });
app.model({ namespace: 'Index', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Index.js').default) });
app.model({ namespace: 'MenuEmployee', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/MenuEmployee.js').default) });
app.model({ namespace: 'MenuUserService', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/MenuUserService.js').default) });
app.model({ namespace: 'Order', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Order.js').default) });
app.model({ namespace: 'PlatformRate', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/PlatformRate.js').default) });
app.model({ namespace: 'Product', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Product.js').default) });
app.model({ namespace: 'ProductRate', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/ProductRate.js').default) });
app.model({ namespace: 'Role', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/Role.js').default) });
app.model({ namespace: 'User', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/User.js').default) });
app.model({ namespace: 'UserCenter', ...(require('/Users/wangbianzhai/Desktop/work/risk/src/models/UserCenter.js').default) });
