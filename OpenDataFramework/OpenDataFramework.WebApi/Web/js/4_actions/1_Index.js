((ns) => {
    const { Common } = ns.utils
    const { DataAccess } = ns.api
    const { Dispatch, GetStateValue } = ns.data.Index

    ns.actions.Index = class Index {
        constructor(target) {
            this.Id = Common.CreateGuid()
            this.EventNames = ["click"]
            this.Target = target

            this.Api = new DataAccess()
        }

        Invoke(e, c) { }

        DispatchAction(apiAction) {
            return (dispatch, type, setResult) =>
                apiAction().then(res => {
                    setResult && setResult(res)
                    dispatch && dispatch({ type: type, data: res })
                    return Promise.resolve({ IsSuccess: true, Data: res })
                }, res => {
                    const msg = res && res.message ? res.message : res
                    dispatch && dispatch({ type: type, data: { ActionFailedMessage: msg } })
                    return Promise.resolve({ IsSuccess: false, Message: msg })
                })
        }

        Edit(c, blUpdate) {
            const { Entity, EditDialog } = this.Target

            let editData = this.Target.GetEditData()
            if (editData === false) return

            if (c.Type === 2) editData.DataStatus = 1;

            if (this.Target.IsLocalData) {
                if (!blUpdate) editData[this.Target.Entity.PrimaryKey] = Common.CreateGuid()
                this.Target.SaveData(editData)
                this.Target.ClearControlValue()
                EditDialog.Close()
                return
            }

            this.EditEntityData(c, [editData], blUpdate, this.Target)
        }

        EditEntityData(c, dataList, blUpdate, editPage) {
            c.SetDisabled(true);
            const { Entity, KeyName, EditDialog } = editPage

            const request = { Data: dataList }

            const name = blUpdate ? "Update" : "Create"
            this.DispatchAction(() => this.Api[name](Entity.Name, request))(Dispatch, KeyName + "_" + name).then(res => {
                if (res.IsSuccess) {
                    Common.Alert("操作成功！").then(() => {
                        editPage.ClearControlValue()
                        EditDialog.Close()
                    })
                    ns.data.Cache.UpdateEntityCacheList(Entity.Name);
                }
                else {
                    Common.Alert(res.Message).then(() => c.SetDisabled(false))
                }
            })
        }

        EditData(entityName, data, blUpdate) {
            const name = blUpdate ? "Update" : "Create"
            const request = { Data: data }

            return this.DispatchAction(() => this.Api[name](entityName, request))();
        }

        GetDataValue(state, keyName, name) {
            return GetStateValue(state, keyName, name, this[name]).then((v) => {
                if (v != null) { this[name] = v }
                return Promise.resolve(v != null)
            })
        }

        GetDataList(entityName, selectNames, conditions) {
            const request = {
                SelectNames: selectNames,
                Conditions: conditions
            }

            return this.DispatchAction(() => this.Api.Query(entityName, request))()
        }

        GetEntityData(entity, selectNames, id) {
            const request = {
                IsRowVersion: true,
                SelectNames: selectNames,
                Conditions: [{ Name: entity.PrimaryKey, Logic: "=", Value: id }]
            }

            if (entity.ComplexQueryList && entity.ComplexQueryList.length > 0) {
                request.ComplexQueryList = []
                entity.ComplexQueryList.forEach(c => {
                    request.ComplexQueryList.push(Object.assign({
                        Conditions: [{ Name: entity.PrimaryKey, Logic: "=", Value: id }]
                    }, c))
                })
            }

            return this.DispatchAction(() => this.Api.Query(entity.Name, request))()
        }

        GetEditText(rowData) {
            const { IsDataRight, LoginUser } = this.DataGrid
            if (IsDataRight) {
                if (LoginUser && rowData.CreateUser === LoginUser.UserId) return this.Label;
                return "";
            }
            return this.Label;
        }

    }

})($ns);