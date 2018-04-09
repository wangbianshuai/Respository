import User from "./User";
import OrderEdit from "./OrderEdit";
import Bill from "./Bill";

export default (config, page) => {
    switch (config.Name) {
        case "User": return new User(config, page);
        case "OrderEdit": return new OrderEdit(config, page);
        case "Bill": return new Bill(config, page);
        default: return null;
    }
};