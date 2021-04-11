import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("accountItemEdit", "AccountItem", 'Abet-实现项目编辑', 900, {
    expandInit() {
        this.deleteProperty = this.getProperty('navTitle').rightProperty;
    },
    setGetEntityDataLoad() {
        if (this.loginUser.OperationRight === 1) this.deleteProperty.setVisible(true);
    }
});