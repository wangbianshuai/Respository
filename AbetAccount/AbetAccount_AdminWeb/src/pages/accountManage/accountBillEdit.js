import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("accountManage_accountBillEdit", "AccountBill", 1300, {
    expandInit() {
        this.billUser = this.getProperty('BillUser');
        this.billUser.defaultValue = this.loginUser.UserId;
    }
}, ['AdminUserService/getUsers', 'AccountCategoryService/getAccountCategorys', 'AccountItemService/getAccountItems']);