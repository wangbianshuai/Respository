import User from "./User";
import OrderEdit from "./OrderEdit";

export default (config, page) => {
    switch (config.Name) {
        case "User": return new User(config, page);
        case "OrderEdit": return new OrderEdit(config, page);
        default: return null;
    }
};