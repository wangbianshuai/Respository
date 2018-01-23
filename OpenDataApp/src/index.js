import dva from 'dva';
import './index.css';
import IndexModel from "./models/Index"
import * as Common from "./utils/Common"

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(GetConfigModel);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

function GetConfigModel() {
    const obj = new IndexModel({
        EntityName: "Config",
        ActionList: [{ ActionName: "GetConfig", StateName: "Data", Method: "GET" }]
    })
    return Common.ToModels(obj)
}