import dva from 'dva';
import Models from './models/index';
import { createBrowserHistory } from 'history';
import './index.scss';

// 1. Initialize
const app = dva({ history: createBrowserHistory() });

// 2. Plugins
// app.use({});

// 3. Model
Models.forEach(m => app.model(m));

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

document.body.addEventListener('touchstart', function () { }, false);