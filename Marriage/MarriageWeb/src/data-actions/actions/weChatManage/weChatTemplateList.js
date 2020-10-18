export default {
  syncWeChatTemplate(id, actionType, data) {
      this.dvaActions.dispatch('A2ApiService', "syncWeChatTemplate", { AppAccountId: data.AppAccountId, action: this.getAction(id, actionType) });
  }
}