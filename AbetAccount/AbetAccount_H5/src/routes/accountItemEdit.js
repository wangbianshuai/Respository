import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("accountItemEdit", "AccountItem", 'Abet-实现项目编辑', 900, {
    expandInit() {
        this.deleteProperty = this.getProperty('navTitle').rightProperty;
    },
    setGetEntityDataLoad() {
        this.deleteProperty.setVisible(true);
    }
});