import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("marriage_userInfo", "MarriageArrangeUser", document.title + '-基本信息', 1800, {
    expandInit() {
        this.porpertyNames = ['Phone', 'IdCard', 'Address', 'NowAddress', 'Birthday', 'BirthTime', 'LunarBirthday', 'BirthEight'];
        this.MarriageUserEditEdit = this.getProperty('marriageUserEditEdit');
        this.MarriageUserEditEdit.properties.forEach(p => {
            if (this.porpertyNames.includes(p.name)) p.isVisible = false;
        })
    },
    setGetEntityDataLoad({ data }) {
        if (data.Phone && data.IdCard) {
            this.MarriageUserEditEdit.properties.forEach(p => {
                if (this.porpertyNames.includes(p.name)) {
                    p.isVisible = true;
                    p.setVisible(true)
                }
            })
        }
    }
});