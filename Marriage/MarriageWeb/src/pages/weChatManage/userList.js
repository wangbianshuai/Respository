import { EntityPageList } from "PageTemplates";

export default EntityPageList("weChatManage_userList", "User", 1500, {
    expandInit() {
        this.cancelUserTagViewProperty = this.getDialogViewPrpoerty("cancelUserTagView");
        this.userTagIdsProperty = this.cancelUserTagViewProperty.properties[0];
        this.cancelUserTagViewProperty.expandDataLoad = this.expandDataLoad.bind(this);
    },
    expandDataLoad(props, action) {
        const { dataGridView } = action.parameters;

        const selectDataList = dataGridView.getSelectDataList();
        let userUserTagList = [];
        selectDataList.forEach(d => {
            if (d.UserUserTags) userUserTagList = userUserTagList.concat(d.UserUserTags);
        });

        const dataSource = [];
        userUserTagList.forEach(d => {
            if (!dataSource.includes(s => s.UserTagId === d.UserTagId)) dataSource.push(d);
        });

        this.userTagIdsProperty.dataSource = dataSource;
        this.userTagIdsProperty.refreshOptions && this.userTagIdsProperty.refreshOptions();
    }
}, ['setUserTag', 'cancelUserTag', 'A2ApiService/syncWeChatUser']);