import { Common, Validate } from "UtilsCommon";
import DataGriViewActionType from '../../actionTypes/components/dataGridView';

export default {
    setgetEntityData(id, actionType, data) {
        data = this.setApiResponse(data);
        if (!data.CallNumber) return data;

        const { CountryCode, CallNumber } = data;
        if (CallNumber) data.CallNumberCode = `+${CountryCode}${CallNumber}`;
        return data;
    },
    applyUserAccount(id, actionType, data) {
        data.formData.Act = 'User_ApplyUserAccount';
        this.saveEntityData(id, actionType, data);
    },
    quitUserAccount(id, actionType, data) {
        data.entityData.LabUID = data.oldEntityData.LabUID;
        data.formData.Act = 'User_QuitUserAccount';
        this.saveEntityData(id, actionType, data);
    },
    changePassword(id, actionType, data) {
        const { NewPwd, AgainPwd } = data.entityData;
        if (NewPwd !== AgainPwd) {
            this.dispatch(id, actionType, { isSuccess: false, message: '两次密码输入不一致' });
            return;
        }
        data.entityData.OldPwd = '';

        this.saveEntityData(id, actionType, data);
    },
    changeCell(id, actionType, data) {
        const { ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberValidCode } = data.entityData;

        if (CallNumber && CountryCode === "86") {
            let res = Validate.validateMobile(CallNumber);
            if (res !== true) {
                this.dispatch(id, actionType, { isSuccess: false, message: res });
                return;
            }
        }

        if (Common.isNullOrEmpty(CallNumberValidCode)) {
            this.dispatch(id, actionType, { isSuccess: false, message: '请输入短信验证码' });
            return;
        }

        const formData = {
            Param: JSON.stringify({ ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberValidCode }),
            Act: 'User_VerifyCallNumberCode'
        };

        this.dvaActions.dispatch("UserService", 'verifyCallNumberCode', { action: this.getAction(id, actionType), formData });
    },
    setchangeCell(id, actionType, data) {
        if (!this.receives[id]) return false;

        data = this.setApiResponse(data);

        if (data.isSuccess === false) return data;

        const { CountryCode, CallNumber, CallNumberToken } = data;

        const formData = {
            Param: JSON.stringify({ CallNumber, CountryCode, CallNumberToken }),
            Act: 'User_ChangeCell'
        };

        this.dvaActions.dispatch("UserService", "changeCell", { action: this.getAction(id, this.actionTypes.verifyCallNumberCode), formData });
        return false
    },
    setverifyCallNumberCode(id, actionType, data) {
        if (!this.receives[id]) return false;

        data = this.setApiResponse(data);

        this.dispatchToReceive(id, this.actionTypes.changeCell, data);
        return false;
    },
    sendSms(id, actionType, data) {
        const { ValidationCodeUID, ValidationCode, CallNumber, CountryCode } = data.entityData;

        if (CallNumber && CountryCode === "86") {
            let res = Validate.validateMobile(CallNumber);
            if (res !== true) {
                this.dispatch(id, actionType, { isSuccess: false, message: res });
                return;
            }
        }

        const formData = {
            Param: JSON.stringify({ ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberUsed: false }),
            Act: 'User_SendCallNumberCode'
        };
        this.dvaActions.dispatch("UserService", "sendSms", { action: this.getAction(id, actionType), formData });
    },
    getFavorites(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType, false) };
        const { pageSize, pageIndex } = data;
        const formData = Common.clone(data.formData)

        if (formData) {
            formData.Param.PageSize = pageSize;
            formData.Param.PageNumber = pageIndex;

            payload.formData = {
                Param: JSON.stringify(formData.Param),
                Act: formData.Act
            };
        }
        this.dvaActions.dispatch(this.serviceName, 'getFavorites', payload);
    },
    setgetFavorites(id, actionType, data) {
        const dataName = data.action ? data.action.dataName : '';
        data = this.setSearchQueryResponse(data, dataName);
        actionType = DataGriViewActionType.searchQuery;
        this.dispatchAction(id, actionType, data);
        return false;
    },
    getLabUser(id, actionType, data) {
        const { formData, entityData } = data;
        const payload = { action: this.getAction(id, actionType) };
        if (formData) {
            formData.Param.UserUID = entityData.UserUID

            payload.formData = {
                Param: JSON.stringify(formData.Param),
                Act: formData.Act
            }
        }

        this.dvaActions.dispatch(this.serviceName, "getLabUser", payload);
    },
    passLabUserApply(id, actionType, data) {
        data.entityData.Status = 100;
        data.entityData.UserUID = data.oldEntityData.UID;

        const payload = { action: this.getAction(id, actionType) };

        payload.formData = {
            Param: JSON.stringify(data.entityData),
            Act: 'User_LabReviewItsApplyingUser'
        };

        this.dvaActions.dispatch(this.serviceName, "passLabUserApply", payload);
    },
    rejectLabUserApply(id, actionType, data) {
        data.entityData.Status = 10;
        data.entityData.UserUID = data.oldEntityData.UID;

        const payload = { action: this.getAction(id, actionType) };

        payload.formData = {
            Param: JSON.stringify(data.entityData),
            Act: 'User_LabReviewItsApplyingUser'
        };

        this.dvaActions.dispatch(this.serviceName, "passLabUserApply", payload);
    },
    getCollaborationInfo(id, actionType, data) {
        const { formData } = data;
        const payload = { action: this.getAction(id, actionType) };
        if (formData) {
            payload.formData = {
                Param: '{}',
                Act: formData.Act
            }
        }

        this.dvaActions.dispatch(this.serviceName, "getCollaborationInfo", payload);
    },
    setgetCollaborationInfo(id, actionType, data) {
        data = this.setApiResponse(data);
        if (data.message === '不存在') return {};
        if (!data.UID) return data;

        const { Status } = data;
        let statusName = '审核中';
        if (Status === 10) statusName = '审核不通过';
        else if (Status === 100) statusName = '审核通过';
        data.StatusName = statusName;

        return data;
    },
    savePartnerLab(id, actionType, data) {
        const image = data.entityData.Image;
        delete data.entityData.Image;

        const payload = { action: this.getAction(id, actionType) };

        const act = data.oldEntityData.UID ? 'Opportunity_UpdateCollaboration' : 'Opportunity_ApplyCollaboration';

        payload.formData = {
            Param: JSON.stringify(data.entityData),
            Act: act
        };

        if (image) {
            const formData = new FormData();
            formData.append("Image", image, image.name);
            formData.set('Act', act);
            formData.set('Param', JSON.stringify(data.entityData));

            payload.formData = formData;
        }

        this.dvaActions.dispatch(this.serviceName, "savePartnerLab", payload);
    },
    searchJob(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType, false) };
        const { pageSize, pageIndex } = data;
        const formData = Common.clone(data.formData)

        if (formData) {
            formData.Param.PageSize = pageSize;
            formData.Param.PageNumber = pageIndex;

            payload.formData = {
                Param: JSON.stringify(formData.Param),
                Act: formData.Act
            };
        }
        this.dvaActions.dispatch(this.serviceName, 'searchJob', payload);
    },
    setsearchJob(id, actionType, data) {
        const dataName = data.action ? data.action.dataName : '';
        data = this.setSearchQueryResponse(data, dataName);
        actionType = DataGriViewActionType.searchQuery;
        this.dispatchAction(id, actionType, data);
        return false;
    },
    getJob(id, actionType, data) {
        const { formData, entityData } = data;
        const payload = { action: this.getAction(id, actionType) };
        if (formData) {
            const { dataPrimaryKey } = formData;
            formData.Param[dataPrimaryKey] = entityData.JobUID

            payload.formData = {
                Param: JSON.stringify(formData.Param),
                Act: formData.Act
            }
        }

        this.dvaActions.dispatch(this.serviceName, "getLabUser", payload);
    },
    saveJob(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType) };

        const act = data.oldEntityData ? 'Opportunity_UpdateJobRelease' : 'Opportunity_CreateJobRelease';

        if (data.oldEntityData) data.entityData.JobReleaseUID = data.oldEntityData.UID;

        payload.formData = {
            Param: JSON.stringify(data.entityData),
            Act: act
        };

        this.dvaActions.dispatch(this.serviceName, "saveJob", payload);
    },
}