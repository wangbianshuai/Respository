import dva from 'dva';
import './index.css';
import * as Common from "./utils/Common"

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/Config').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

Common.App = app