import { EntityPageEdit } from "PageTemplates";
import { Common } from 'UtilsCommon';

export default EntityPageEdit("accountBillEdit", "AccountBill", 'Abet-记账-编辑', 400, {
    expandInit() {
        this.deleteProperty = this.getProperty('navTitle').rightProperty;
        this.saveProperty = this.getProperty('saveEntityData');
        this.saveProperty.isVisible = !this.pageData.BillId;
    },
    setGetEntityDataLoad({ data }) {
        if (Common.isEquals(data.CreateUser, this.loginUser.UserId, true)) {
            this.deleteProperty.setVisible(true);
            this.saveProperty.setVisible(true);
        }
    }
}, ['AdminUserService/getUsers', 'AccountCategoryService/getAccountCategorys', 'AccountItemService/getAccountItems']);