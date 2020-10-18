import { EntityPageList } from "PageTemplates";

export default EntityPageList("footmark_index", "Footmark", '历史足迹', 1800, {
    judgeRequireLogin() {
        return !this.judgeLogin();
    }
}, ['searchLibraryHistory', 'searchActivityHistory', 'searchVideoHistory']);