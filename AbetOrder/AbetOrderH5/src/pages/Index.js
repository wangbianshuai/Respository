import User from "./User";

export default (config, page) => {
    switch (config.Name) {
        case "User": return new User(config, page);
        default: return null;
    }
};