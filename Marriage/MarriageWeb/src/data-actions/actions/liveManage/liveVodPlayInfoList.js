export default {
    syncPlayFlux(id, actionType, data) {
        this.dvaActions.dispatch('LiveVodPlayInfoService', "syncPlayFlux", { LiveVodPlayInfo: data.entityData, action: this.getAction(id, actionType) });
    }
}