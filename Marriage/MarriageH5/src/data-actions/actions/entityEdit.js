import BaseIndex from "../baseIndex";
import Expand from "./expand";

export default class EntityEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.init();

        this.initexpand();
    }

    initexpand() {
        if (Expand[this.name]) {
            const expand = Expand[this.name]
            for (var key in expand) this[key] = expand[key];
        }
    }

    getEntityData(id, actionType, data) {
        const { primaryKey, isNumber } = data.entity;
        const primaryKeyValue = data.entityData[primaryKey];
        const { formData } = data;
        const payload = { action: this.getAction(id, actionType) };
        if (formData) {
            const key = formData.dataPrimaryKey || primaryKey;
            formData.Param[key] = isNumber ? parseInt(primaryKeyValue, 10) : primaryKeyValue;

            payload.formData = {
                Param: JSON.stringify(formData.Param),
                Act: formData.Act
            }
        }

        this.dvaActions.dispatch(this.serviceName, "getEntityData", payload);
    }

    saveEntityData(id, actionType, data) {
        const { primaryKey, updateAct, createAct, dataPrimaryKey } = data.entity;
        const { entityData } = data;
        let primaryKeyValue = data.oldEntityData && data.oldEntityData[primaryKey] ? data.oldEntityData[primaryKey] : null;
        if (!primaryKeyValue) primaryKeyValue = data.oldEntityData && data.oldEntityData[dataPrimaryKey] ? data.oldEntityData[dataPrimaryKey] : null;
        if (primaryKeyValue) entityData[primaryKey] = primaryKeyValue;

        const { formData } = data;
        const payload = { action: this.getAction(id, actionType) };
        if (formData) {
            payload.formData = {
                Param: JSON.stringify(entityData),
                Act: formData.Act
            }
            if (primaryKeyValue && updateAct) payload.formData.Act = updateAct;
            else if (createAct) payload.formData.Act = createAct;
        }

        this.dvaActions.dispatch(this.serviceName, "saveEntityData", payload);
    }

    deleteEntityData(id, actionType, data) {
        const { primaryKey, deleteAct } = data.entity;

        const entityData = {};
        entityData[primaryKey] = data.entityData[primaryKey]

        const payload = { action: this.getAction(id, actionType) };

        payload.formData = {
            Param: JSON.stringify(entityData),
            Act: deleteAct
        }

        this.dvaActions.dispatch(this.serviceName, "deleteEntityData", payload);
    }
}
