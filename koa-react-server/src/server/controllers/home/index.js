import BaseIndex from "../Index";

export default class Index extends BaseIndex {
    constructor(ctx, dva) {
        super(ctx, dva);
    }

    LoadData() {
        return this.Dispatch("User", "GetUserInfo");
    }
}