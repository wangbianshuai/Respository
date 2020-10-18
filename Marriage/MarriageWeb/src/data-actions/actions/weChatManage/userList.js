export default {
    setUserTag(id, actionType, data) {
        const { selectData, selectRowKeys } = data;
        selectData.UserIds = selectRowKeys;

        this.dvaActions.dispatch(this.serviceName, "setUserTag", { User: selectData, action: this.getAction(id, actionType) });
    },
    cancelUserTag(id, actionType, data) {
        const { selectData, selectRowKeys } = data;
        selectData.UserIds = selectRowKeys;

        this.dvaActions.dispatch(this.serviceName, "cancelUserTag", { User: selectData, action: this.getAction(id, actionType) });
    },
    syncWeChatUser(id, actionType, data) {
        this.dvaActions.dispatch('A2ApiService', "syncWeChatUser", { AppAccountId: data.AppAccountId, action: this.getAction(id, actionType) });
    }
}