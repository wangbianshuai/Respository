import Bill from "./Bill";
import DealingsBill from "./DealingsBill";
import BillType from "./BillType";
import DealingsBillType from "./DealingsBillType";

export default (config, page) => {
    switch (config.Name) {
        case "Bill": return new Bill(config, page);
        case "DealingsBill": return new DealingsBill(config, page);
        case "BillType": return new BillType(config, page);
        case "DealingsBillType": return new DealingsBillType(config, page);
        default: return null;
    }
};