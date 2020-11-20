import { EntityPageEdit } from "PageTemplates";
import { Common } from 'UtilsCommon';

export default EntityPageEdit("marriage_marriageStatus", "MarriageStatus", document.title + '-相亲状态', 1800, {
    expandInit() {
        const statusView = this.getProperty("marriageStatusEditEdit");

        this.isManAgree = this.getViewProperty(statusView, "IsManAgree");
        this.isManAgree.valueChange = this.isManAgreeChange.bind(this);

        this.noManAgreeRemark = this.getViewProperty(statusView, "NoManAgreeRemark");

        this.isWomanAgree = this.getViewProperty(statusView, "IsWomanAgree");
        this.isWomanAgree.valueChange = this.isWomanAgreeChange.bind(this);

        this.noWomanAgreeRemark = this.getViewProperty(statusView, "NoWomanAgreeRemark");
    },
    isManAgreeChange(value) {
        if (!this.noManAgreeRemark.setVisible) return;
        const isVisible = value === 0;
        this.noManAgreeRemark.setVisible(isVisible);
        this.noManAgreeRemark.isVisible = isVisible;
    },
    isWomanAgreeChange(value) {
        if (!this.noWomanAgreeRemark.setVisible) return;
        const isVisible = value === 0;
        this.noWomanAgreeRemark.setVisible(isVisible);
        this.noWomanAgreeRemark.isVisible = isVisible;
    },
    expandSetEntityData({ entityData, props, view }) {
        let message = '';
        const { Status } = entityData;
        if (Status === 0 || Status === 1 || Status === 3) {
            entityData.IsManAgree = 0;
            entityData.NoManAgreeRemark = '';
            entityData.IsWomanAgree = 0;
            entityData.NoWomanAgreeRemark = '';
            entityData.CancelReason = '';
            entityData.BookMarryDate = null;
            entityData.MarryDate = null;
            entityData.BreakUpDate = null;
            entityData.BreakUpReason = '';
        }
        else if (Status === 2) {
            entityData.CancelReason = '';
            entityData.BookMarryDate = null;
            entityData.MarryDate = null;
            entityData.BreakUpDate = null;
            entityData.BreakUpReason = '';

            if (entityData.IsManAgree === 0 && Common.isNullOrEmpty(entityData.NoManAgreeRemark)) {
                message = "当男方不同意时，需输入不同意原因！";
            }
            else if (entityData.IsWomanAgree === 0 && Common.isNullOrEmpty(entityData.NoWomanAgreeRemark)) {
                message = "当女主不同意时，需输入不同意原因！";
            }
            else if (entityData.IsManAgree === 1 && entityData.IsWomanAgree === 1) {
                message = "当状态为无意向时，男女双方不能选择都同意！";
            }
            else {
                if (entityData.IsManAgree) entityData.NoManAgreeRemark = '';
                if (entityData.IsWomanAgree) entityData.NoWomanAgreeRemark = '';
            }
        }
        else if (Status === 4) {
            entityData.IsManAgree = 0;
            entityData.NoManAgreeRemark = '';
            entityData.IsWomanAgree = 0;
            entityData.NoWomanAgreeRemark = '';
            entityData.CancelReason = '';
            entityData.BreakUpDate = null;
            entityData.BreakUpReason = '';

            if (Common.isNullOrEmpty(entityData.BookMarryDate)) {
                message = "请选择订婚日期！";
            }
        }
        else if (Status === 5) {
            entityData.IsManAgree = 0;
            entityData.NoManAgreeRemark = '';
            entityData.IsWomanAgree = 0;
            entityData.NoWomanAgreeRemark = '';
            entityData.CancelReason = '';
            entityData.BreakUpDate = null;
            entityData.BreakUpReason = '';

            if (Common.isNullOrEmpty(entityData.MarryDate)) {
                message = "请选择结婚日期！";
            }
        }
        else if (Status === 6) {
            entityData.IsManAgree = 0;
            entityData.NoManAgreeRemark = '';
            entityData.IsWomanAgree = 0;
            entityData.NoWomanAgreeRemark = '';
            entityData.CancelReason = '';

            if (Common.isNullOrEmpty(entityData.BreakUpDate)) {
                message = "请选择分手日期！";
            }
            else if (Common.isNullOrEmpty(entityData.BreakUpReason)) {
                message = '请输入分手原因！'
            }
        }
        else if (Status === 7) {
            if (Common.isNullOrEmpty(entityData.CancelReason)) {
                message = '请输入取消原因！'
            }
        }

        if (message) {
            this.alert(message);
            return false;
        }
        return entityData;
    },
});