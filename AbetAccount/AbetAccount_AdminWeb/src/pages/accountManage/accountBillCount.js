import { EntityPageList } from "PageTemplates";

export default EntityPageList("accountManage_accountBillCount", "AccountBill", 1400, null, ['AdminUserService/getUsers', 'CustomerService/getCustomers', 'AccountTypeService/getUserAccountTypes']);