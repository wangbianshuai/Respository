import DealingsBillDataRow from "./DealingsBillDataRow";

export default (page, data, index) => {
    const name = page.props.PageConfig.DataRowName || page.props.PageName
    switch (name) {
        case "DealingsBill": return DealingsBillDataRow(page, data, index);
        default: return null;
    }
};