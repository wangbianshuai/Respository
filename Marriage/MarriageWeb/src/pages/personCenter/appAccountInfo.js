import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("personCenter_appAccountInfo", "AppAccount", 800, {
    expandInit() {
        this.pageData.AppAccountId = this.loginUser.AppAccountId;
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