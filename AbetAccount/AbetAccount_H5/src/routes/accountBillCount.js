import { EntityPageList } from "PageTemplates";

export default EntityPageList("accountBillCount", "AccountBill", 'Abet-记账统计', 500, null, ['AdminUserService/getUsers', 'AccountCategoryService/getAccountCategorys', 'AccountItemService/getAccountItems']);