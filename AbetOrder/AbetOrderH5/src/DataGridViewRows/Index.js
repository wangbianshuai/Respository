import DealingsBillDataRow from "./DealingsBillDataRow";

export default (page, dataGridView, data, index) => {
    const name = page.props.PageConfig.DataRowName || page.props.PageName
    switch (name) {
        case "DealingsBill": return DealingsBillDataRow(page, dataGridView, data, index);
        default: return null;
    }
};