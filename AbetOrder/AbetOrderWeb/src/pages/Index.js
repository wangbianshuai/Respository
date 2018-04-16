import User from "./User";
import OrderEdit from "./OrderEdit";
import Bill from "./Bill";
import DealingsBill from "./DealingsBill";
import OrderList from "./OrderList";
import ProcessOrderList from "./ProcessOrderList";
import BillType from "./BillType";
import DealingsBillType from "./DealingsBillType";

export default (config, page) => {
    switch (config.Name) {
        case "User": return new User(config, page);
        case "OrderEdit": return new OrderEdit(config, page);
        case "Bill": return new Bill(config, page);
        case "DealingsBill": return new DealingsBill(config, page);
        case "OrderList": return new OrderList(config, page);
        case "ProcessOrderList": return new ProcessOrderList(config, page);
        case "BillType": return new BillType(config, page);
        case "DealingsBillType": return new DealingsBillType(config, page);
        default: return null;
    }
};