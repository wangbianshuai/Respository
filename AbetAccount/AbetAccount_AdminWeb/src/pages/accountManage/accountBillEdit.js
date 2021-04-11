import { EntityPageEdit } from "PageTemplates";
import { Common } from 'UtilsCommon';

export default EntityPageEdit("accountManage_accountBillEdit", "AccountBill", 1300, {
    expandInit() {
        this.billUser = this.getProperty('BillUser');
        this.billUser.defaultValue = this.loginUser.UserId;

        this.accountType = this.getProperty('AccountType');
        this.accountType.valueChange = (v) => this.setTax(v, null);
        this.amount = this.getProperty('Amount');
        this.amount.valueChange = (v) => this.setTax(null, v);
        this.tax = this.getProperty('Tax');
    },
    setTax(accountType, amount) {
        if (accountType == null) accountType = this.accountType.getValue ? this.accountType.getValue() : 0;
        if (amount == null) amount = this.amount.getValue ? this.amount.getValue() : 0;

        const isChanged = this.accountType.isChanged || this.amount.isChanged;

        if (parseInt(accountType) === 1 && isChanged) {
            amount = Common.getNumber(amount);
            const tax = amount > 0 ? (amount * 0.07).toFixed(2) : 0;
            this.tax.setValue(tax);
        }
    }
}, ['AdminUserService/getUsers', 'AccountCategoryService/getAccountCategorys', 'AccountItemService/getAccountItems']);