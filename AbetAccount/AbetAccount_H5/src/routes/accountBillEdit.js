import { EntityPageEdit } from "PageTemplates";
import { Common } from 'UtilsCommon';

export default EntityPageEdit("accountBillEdit", "AccountBill", 'Abet-记账-编辑', 400, {
    expandInit() {
        this.billUser = this.getProperty('BillUser');
        this.billUser.defaultValue = this.loginUser.UserId;

        this.accountType = this.getProperty('AccountType');
        this.accountType.valueChange = (v) => this.setTax(v, null);
        this.amount = this.getProperty('Amount');
        this.amount.valueChange = (v) => this.setTax(null, v);
        this.tax = this.getProperty('Tax');

        this.deleteProperty = this.getProperty('navTitle').rightProperty;
        this.saveProperty = this.getProperty('saveEntityData');
        this.saveProperty.isVisible = !this.pageData.BillId;
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
    },
    setGetEntityDataLoad({ data }) {
        if (Common.isEquals(data.CreateUser, this.loginUser.UserId, true)) {
            this.deleteProperty.setVisible(true);
            this.saveProperty.setVisible(true);
        }
    }
}, ['AdminUserService/getUsers', 'AccountCategoryService/getAccountCategorys', 'AccountItemService/getAccountItems']);