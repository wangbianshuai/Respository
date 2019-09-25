import { EntityPageEdit } from "PageTemplates";
import { Common } from "UtilsCommon";

const UserEdit = {
    ExpandSetUserData: function ({ entityData, props, view }) {
        const isUpdate = view.EntityData && view.EntityData.User_Id;
        if (!isUpdate && Common.IsNullOrEmpty(entityData.Login_Password)) {
            this.Alert("登录密码不能为空！"); return;
        }

        if (!Common.IsNullOrEmpty(entityData.Login_Password) && !Common.IsEquals(entityData.Login_Password, entityData.Login_AgainPassword)) {
            this.Alert("登录密码与确认密码不一致！")
            return false;
        }

        return entityData;
    }
};

export default EntityPageEdit("SystemManage_UserEdit", "User", 700, UserEdit);
