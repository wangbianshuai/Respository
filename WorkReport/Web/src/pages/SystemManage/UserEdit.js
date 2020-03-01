import { EntityPageEdit } from "PageTemplates";
import { Common, Md5 } from "UtilsCommon";

const UserEdit = {
    ExpandSetUserData: function ({ entityData, props, view }) {
        const isUpdate = view.EntityData && view.EntityData.UserId;
        if (!isUpdate && Common.IsNullOrEmpty(entityData.LoginPassword)) {
            this.Alert("登录密码不能为空！"); return;
        }

        if (!Common.IsNullOrEmpty(entityData.LoginPassword) && !Common.IsEquals(entityData.LoginPassword, entityData.LoginAgainPassword)) {
            this.Alert("登录密码与确认密码不一致！")
            return false;
        }

        if (entityData.LoginPassword) entityData.LoginPassword = Md5(entityData.LoginPassword);
        else delete entityData.LoginPassword;

        return entityData;
    }
};

export default EntityPageEdit("SystemManage_UserEdit", "User", 700, UserEdit);
