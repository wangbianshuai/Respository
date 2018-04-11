import User from "./User";
import OrderEdit from "./OrderEdit";
import Bill from "./Bill";
import DealingsBill from "./DealingsBill";

export default (config, page) => {
    switch (config.Name) {
        case "User": return new User(config, page);
        case "OrderEdit": return new OrderEdit(config, page);
        case "Bill": return new Bill(config, page);
        case "DealingsBill": return new DealingsBill(config, page);
        default: return null;
    }
};