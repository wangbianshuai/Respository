import BaseIndex from "../../baseIndex";

export default class DataGridView extends BaseIndex {
  constructor(props) {
    super(props);

    this.name = "components_dataGridView";
    this.minActionType = 300;
    this.maxActionType = 399;

    this.init();
  }

  searchQuery(id, actionType, data) {
    const { entity } = data;

    if (data.entitySearchQuery) {
      data.dataGridViewSearchQuery = actionType;
      data.entityName = entity.name;
      this.invokeAction(id, data.entitySearchQuery, data);
    }
  }

  setsearchQuery(id, action, data) {
    if (!this.receives[id]) return false;
    return data;
  }
}
