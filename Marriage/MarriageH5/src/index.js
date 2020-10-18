import dva from 'dva';
import Models from './models/index';
import './index.scss';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
Models.forEach(m => app.model(m));

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

//接收postMessage 信息
window.addEventListener('message', (e) => {
    const { data } = e;
    if (!data) return;
    const { actionName, payload } = data;
    if (actionName) app._store.dispatch({ type: `ReceiveMessage/${actionName}`, payload });
});
