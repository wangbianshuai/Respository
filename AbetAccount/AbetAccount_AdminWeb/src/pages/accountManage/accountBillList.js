import { EntityPageList } from "PageTemplates";

export default EntityPageList("accountManage_accountBillList", "AccountBill", 1200, null, ['AdminUserService/getUsers', 'AccountCategoryService/getAccountCategorys', 'AccountItemService/getAccountItems']);