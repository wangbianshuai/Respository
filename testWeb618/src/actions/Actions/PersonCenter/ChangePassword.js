import BaseIndex from "../../BaseIndex";
import { Common, Md5 } from "UtilsCommon";

export default class ChangePassword extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "PersonCenter_ChangePassword";
        this.MinActionType = 4100;
        this.MaxActionType = 4199;

        this.Init();
    }

    //修改密码
    ChangePassword(id, actionType, data) {
        const { EntityData } = data;
        if (!Common.IsNullOrEmpty(EntityData.NewPassword) && !Common.IsEquals(EntityData.NewPassword, EntityData.AgainNewPassword)) {
            this.Dispatch(id, actionType, { IsSuccess: false, Message: "新密码与确认密码不一致！" });
            return false;
        }

        EntityData.OldPassword = Md5(EntityData.OldPassword);
        EntityData.NewPassword = Md5(EntityData.NewPassword);
        
        this.DvaActions.Dispatch("ApiService", "ChangePassword", { Action: this.GetAction(id, actionType), AdminUser: EntityData });
    }
}