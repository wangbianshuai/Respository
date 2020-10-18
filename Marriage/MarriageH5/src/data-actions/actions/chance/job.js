export default {
    setgetEntityData(id, actionType, data) {
        data = this.setApiResponse(data);
        if (!data.UID) return data;

        const { VAddCCnName, VAddPCnName,VAddCnName } = data
        data.CityName = `${VAddCnName}-${VAddPCnName}-${VAddCCnName}`;
        return data;
    },
}