import * as Common from "../utils/Common";
import ComputeMd5 from "../utils/Md5";

export default class User {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.EditView.ExpandSetEditData = (data) => this.ExpandSetEditData(data);
    }

    ExpandSetEditData(data) {
        const { EditView } = this.PageConfig;

        let message = "", blSucceed = true
        if (Common.IsEmptyObject(EditView.EntityData)) {
            if (!data.LoginPassword) {
                message = "登录密码不能为空！"
                blSucceed = false
            }
        }
        if (blSucceed && !Common.IsNullOrEmpty(data.LoginPassword) && data.LoginPassword !== data.AgainLoginPassword) {
            message = "登录密码与确认密码不一致！"
            blSucceed = false
        }
        if (!blSucceed) {
            this.Page.ShowMessage(message)
            return false
        }

        if (data.AgainLoginPassword) delete data.AgainLoginPassword;
        if (data.LoginPassword) data.LoginPassword = ComputeMd5(data.LoginPassword)

        if (Common.IsNullOrEmpty(data.LoginPassword)) delete data.LoginPassword;

        return data
    }

}