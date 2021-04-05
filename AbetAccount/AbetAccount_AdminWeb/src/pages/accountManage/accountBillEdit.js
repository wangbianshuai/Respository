import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("accountManage_accountBillEdit", "AccountBill", 1300, {
    expandInit() {
        this.AccountTypeId = this.getProperty('AccountTypeId');
        this.CustomerId = this.getProperty('CustomerId');
        this.AccountTypeId.valueChange = this.accountTypeValueChange.bind(this);
    },
    accountTypeValueChange(value, selectData) {
        const visible = selectData != null && selectData.IsHaveCustomer === 1;
        this.CustomerId.setFormItemVisible && this.CustomerId.setFormItemVisible(visible);
        this.CustomerId.isVisible = visible;
    }
}, ['CustomerService/getCustomers', 'AccountTypeService/getUserAccountTypes']);