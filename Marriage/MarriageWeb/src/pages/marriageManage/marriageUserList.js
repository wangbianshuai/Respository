import { EntityPageList } from "PageTemplates";

export default EntityPageList("marriageManage_marriageUserList", "MarriageUser", 900, {
    expandInit() {
        this.updateApprovalViewProperty = this.getDialogViewPrpoerty("updateApprovalView");
        this.updateApprovalViewProperty.expandDataLoad = this.updateApprovalDataLoad.bind(this);
    },
    updateApprovalDataLoad(props, aciton, selectDataList) {
        aciton.currentValue = selectDataList[0];
    }
}, ['updateStatus', 'getViewEntityData', 'MarriageUserPhotoService/getMarriageUserPhotos', 'UserConditionTypeService/getUserConditionType1', 'UserConditionTypeService/getUserConditionType2']);