import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("square_userInfo", "MarriageSquareUser", document.title + '-基本信息', 1400, {
    expandInit() {
        const names = ['Phone', 'IdCard', 'Address', 'NowAddress', 'Birthday', 'BirthTime', 'LunarBirthday', 'BirthEight'];
        const marriageUserEditEdit = this.getProperty('marriageUserEditEdit');
        marriageUserEditEdit.properties.forEach(p => {
            if (names.includes(p.name)) p.isVisible = false;
        })
    }
});