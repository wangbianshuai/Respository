export default {
    ReSend(id, actionType, data) {
        const LogIds = data.SelectRowKeys;
        this.DvaActions.Dispatch("RequestServiceLogService", "ReSend", { RequestServiceLog: LogIds, Action: this.GetAction(id, actionType) });
    }
}