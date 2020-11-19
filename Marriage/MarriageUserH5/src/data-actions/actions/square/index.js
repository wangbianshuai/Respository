export default {
  searchSend(id, actionType, data) {
    this.searchQuery(id, actionType, data, 'searchSend');
  },
  setsearchSend(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  },
  searchReceive(id, actionType, data) {
    this.searchQuery(id, actionType, data, 'searchReceive');
  },
  setsearchReceive(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  },
  searchMutual(id, actionType, data) {
    this.searchQuery(id, actionType, data, 'searchMutual');
  },
  setsearchMutual(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  }
}