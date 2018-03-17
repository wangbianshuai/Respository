import StaticSource from "./StaticSource";
import ContentEdit from "./ContentEdit"

export default (config, page) => {
    switch (config.Name) {
        case "StaticSource": return new StaticSource(config, page);
        case "ContentEdit": return new ContentEdit(config, page);
        default: return null;
    }
};