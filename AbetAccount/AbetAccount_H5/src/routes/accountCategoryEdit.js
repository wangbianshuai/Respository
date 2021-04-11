import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("accountCategoryEdit", "AccountCategory", 'Abet-收支类别编辑', 700, {
    expandInit() {
        this.deleteProperty = this.getProperty('navTitle').rightProperty;
    },
    setGetEntityDataLoad() {
        this.deleteProperty.setVisible(true);
    }
});