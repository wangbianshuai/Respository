import { EntityPageInfo } from "PageTemplates";

export default EntityPageInfo("spectral_tools", "Spectral", '工具', 3100, {
    expandInit() {
        const index = parseInt(this.pageData.index, 10) - 1;
        this.toolsEditProperty = this.getProperty("toolsEdit");
        if (index >= 0 && index <= 3) this.toolsEditProperty.properties = [this.toolsEditProperty.properties[index]];
        else this.toolsEditProperty.properties = [];
    }
});