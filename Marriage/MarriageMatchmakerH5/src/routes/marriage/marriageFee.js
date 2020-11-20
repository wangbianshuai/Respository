import { EntityPageEdit } from "PageTemplates";
import { Common } from 'UtilsCommon';

export default EntityPageEdit("marriage_marriageFee", "MarriageFee", document.title + '-相亲费用', 1700, {
    expandInit() {
        this.updateFeeViewProperty = this.getProperty("marriageFeeEditEdit");
        this.manAmountProperty = this.getViewProperty(this.updateFeeViewProperty, "ManAmount");
        this.manAmountProperty.valueChange = this.amountChange.bind(this);
        this.manAppAmountProperty = this.getViewProperty(this.updateFeeViewProperty, "ManAppAmount");
        this.manAppAmountProperty.valueChange = this.amountChange.bind(this);
        this.womanAmountProperty = this.getViewProperty(this.updateFeeViewProperty, "WomanAmount");
        this.womanAmountProperty.valueChange = this.amountChange.bind(this);
        this.womanAppAmountProperty = this.getViewProperty(this.updateFeeViewProperty, "WomanAppAmount");
        this.womanAppAmountProperty.valueChange = this.amountChange.bind(this);
        this.appAmountProperty = this.getViewProperty(this.updateFeeViewProperty, "AppAmount");
        this.appAmountProperty.valueChange = this.amountChange.bind(this);
        this.appAppAmountProperty = this.getViewProperty(this.updateFeeViewProperty, "AppAppAmount");
        this.appAppAmountProperty.valueChange = this.amountChange.bind(this);

        this.amountProperty = this.getViewProperty(this.updateFeeViewProperty, "Amount");
    },
    amountChange() {
        const manAmmount = Common.getNumber(this.manAmountProperty.getValue());
        const manAppAmmount = Common.getNumber(this.manAppAmountProperty.getValue());
        const womanAmmount = Common.getNumber(this.womanAmountProperty.getValue());
        const womanAppAmmount = Common.getNumber(this.womanAppAmountProperty.getValue());
        const appAmmount = Common.getNumber(this.appAmountProperty.getValue());
        const appAppAmmount = Common.getNumber(this.appAppAmountProperty.getValue());

        const amount = manAmmount + manAppAmmount + womanAmmount + womanAppAmmount + appAmmount + appAppAmmount;
        this.amountProperty.setValue(amount)
    }
});