import { EntityPageList } from "PageTemplates";

export default EntityPageList("accountBillList", "AccountBill", 'Abet-记账', 200, null, ['AdminUserService/getUsers', 'AccountCategoryService/getAccountCategorys', 'AccountItemService/getAccountItems']);