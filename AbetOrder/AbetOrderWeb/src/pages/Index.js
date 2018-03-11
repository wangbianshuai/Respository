import StaticSource from "./StaticSource";

export default (config, page) => {
    switch (config.Name) {
        case "StaticSource": return new StaticSource(config, page);
        default: return null;
    }
};