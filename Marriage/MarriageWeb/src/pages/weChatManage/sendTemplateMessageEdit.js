import { EntityPageEdit } from "PageTemplates";
import { Common } from "UtilsCommon";

export default EntityPageEdit("weChatManage_sendTemplateMessageEdit", "SendTemplateMessage", 1800, {
    expandInit() {
        this.templateIdProperty = this.getProperty("TemplateId");
        this.propertiesProperty = this.getProperty("Properties");
        this.sendTemplateMessageEdit2Property = this.getProperty("sendTemplateMessageEdit2");

        this.templateIdProperty.valueChange = this.templateIdChange.bind(this);
    },
    templateIdChange(value, selectData) {
        const propertyList = this.parseContentProperties(selectData ? selectData.Content : '', value, this.propertiesProperty.getValue());

        if (this.propertiesProperty.setValue) this.propertiesProperty.setValue(propertyList);
        else this.propertiesProperty.value = propertyList;
    },
    parseContentProperties(content, value, dataList) {
        if (!content) return [];

        const nameList = content.match(/[^\[\{]+(?=\.DATA})/g);

        const { entityData } = this.sendTemplateMessageEdit2Property;

        const propertyList = [];
        if (entityData && dataList.length > 0 && Common.isEquals(entityData.TemplateId, value, true)) {
            nameList.forEach(n => {
                const data = Common.arrayFirst(dataList, f => f.PropertyName === n);
                if (data == null) propertyList.push({ PropertyName: n });
                else propertyList.push(data);
            });
        }
        else {
            nameList.forEach(n => {
                propertyList.push({ PropertyName: n });
            });
        }

        return propertyList;
    }
}, ["saveEntityDataToSend"]);