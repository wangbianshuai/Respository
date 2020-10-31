import BaseIndex from '../../baseIndex';
import { Common, Md5 } from 'UtilsCommon';

export default class ChangePassword extends BaseIndex {
    constructor(props) {
        super(props);

        this.name = 'personCenter_changePassword';
        this.minActionType = 4100;
        this.maxActionType = 4199;

        this.init();
    }

    //修改密码
    changePassword(id, actionType, data) {
        const { entityData } = data;
        if (!Common.isNullOrEmpty(entityData.NewPassword) && !Common.isEquals(entityData.NewPassword, entityData.AgainNewPassword)) {
            this.dispatch(id, actionType, { isSuccess: false, message: '新密码与确认密码不一致！' });
            return false;
        }

        entityData.OldPassword = Md5(entityData.OldPassword);
        entityData.NewPassword = Md5(entityData.NewPassword);
        
        this.dvaActions.dispatch('AppUserService', 'changePassword', { action: this.getAction(id, actionType), AppUser: entityData });
    }
}