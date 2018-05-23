import DealingsBillDataRow from "./DealingsBillDataRow";
import BillDataRow from "./BillDataRow";
import BillTypeDataRow from "./BillTypeDataRow";
import DealingsBillTypeDataRow from "./DealingsBillTypeDataRow";
import PersonBillDataRow from "./PersonBillDataRow";

export default (page, dataGridView, data, index) => {
    const name = page.props.PageConfig.DataRowName || page.props.PageName
    switch (name) {
        case "DealingsBill": return DealingsBillDataRow(page, dataGridView, data, index);
        case "Bill": return BillDataRow(page, dataGridView, data, index);
        case "BillType": return BillTypeDataRow(page, dataGridView, data, index);
        case "DealingsBillType": return DealingsBillTypeDataRow(page, dataGridView, data, index);
        case "PersonBill": return PersonBillDataRow(page, dataGridView, data, index);
        default: return null;
    }
};