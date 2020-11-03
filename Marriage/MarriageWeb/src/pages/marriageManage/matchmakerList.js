import { EntityPageList } from "PageTemplates";

export default EntityPageList("marriageManage_matchmakerList", "Matchmaker", 800, {
    expandInit() {
        this.updateApprovalViewProperty = this.getDialogViewPrpoerty("updateApprovalView");
        this.updateApprovalViewProperty.expandDataLoad = this.updateApprovalDataLoad.bind(this);
    },
    updateApprovalDataLoad(props, aciton, selectDataList) {
        aciton.currentValue = selectDataList[0];
    }
}, ['updateStatus', 'getViewEntityData']);