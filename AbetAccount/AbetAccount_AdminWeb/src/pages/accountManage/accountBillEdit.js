import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("accountManage_accountBillEdit", "AccountBill", 1300, null, ['AdminUserService/getUsers', 'AccountCategoryService/getAccountCategorys', 'AccountItemService/getAccountItems']);