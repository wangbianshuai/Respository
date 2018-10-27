export default class Index {
    constructor(ctx, dva) {
        this.ctx = ctx;
        this.dva = dva;
        this.Model = this.GetModel();
    }

    GetModel() {
        return {
            title: "【新新贷官网】专业透明的P2P网络借贷平台，P2P网贷，网上贷款借款、投融资信息中介平台",
            keywords: "新新贷，P2P网贷，P2P理财，投资理财，网上理财，新元宝，月月派，新手专享，投融资，贷款，企业贷款，无抵押小额贷款，借款",
            description: "新新贷是中国专业的互联网金融P2P网络借贷信息中介平台，为出借人和借款人提供省心的互联网金融信息服务。资金银行存管、严格的风控体系、信息披露透明等多重安全保障措施。"
        }
    }

    LoadData() {
        return Promise.resolve(true);
    }

    Dispatch(name, actionName, payload) {
        return new Promise((resolve, reject) => {
            try {
                this.dva.app._store && this.dva.app._store.dispatch({ type: name + "/" + actionName, payload, isloading: false, callback: (res) => resolve(res) })
            }
            catch (err) { reject(err); }
        });
    }

}