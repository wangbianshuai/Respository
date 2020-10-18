import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("systemManage_appAccountEdit", "AppAccount", 200, {
    expandInit() {
        this.accessPathNameProperty = this.getProperty("AccessPathName");
        this.apiUrlProperty = this.getProperty("ApiUrl");

        this.accessPathNameProperty.valueChange = this.accessPathNameValueChange.bind(this);
    },
    accessPathNameValueChange(value) {
        const { ReceiveMessageApiUrl } = this.loginUser;
        let url = '';
        if (ReceiveMessageApiUrl && value) url = ReceiveMessageApiUrl.replace('{pathName}', value);
        this.apiUrlProperty.setValue(url);
    }
});