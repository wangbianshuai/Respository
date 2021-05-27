import { EntityPageEdit } from "PageTemplates";
import { Common } from 'UtilsCommon';

export default EntityPageEdit("accountManage_accountBillEdit", "AccountBill", 1300, null, ['AdminUserService/getUsers', 'AccountCategoryService/getAccountCategorys', 'AccountItemService/getAccountItems']);