export default {
    setgetEntityData(id, actionType, data) {
        data = this.setApiResponse(data);
        if (!data.StartDate) return data;

        const { StartDate, EndDate, Contents } = data
        data.StartEndDate = `${StartDate} - ${EndDate}`;
        if (Contents) data.WeixinPageUID = '';
        return data;
    },
}