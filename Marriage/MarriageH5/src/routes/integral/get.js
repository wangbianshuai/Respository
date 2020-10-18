import { EntityPageList } from "PageTemplates";

export default EntityPageList("integral_get", "Integral", '索取积分', 2400, {
    judgeRequireLogin() {
        return !this.judgeLogin();
    },
    expandInit() {
        this.tabs1Property = this.getProperty('tabs1');

        if (this.loginUser.UserType !== 20) {
            this.tabs1Property.properties = this.tabs1Property.properties.filter(f => f.name !== 'experienceView')
        }
    }
}, ['searchGet', 'searchQuestionnaire', 'searchExperience','searchDocument']);