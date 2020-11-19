export default {
  searchBoy(id, actionType, data) {
    this.searchQuery(id, actionType, data, 'searchBoy');
  },
  setsearchBoy(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  },
  searchGirl(id, actionType, data) {
    this.searchQuery(id, actionType, data, 'searchGirl');
  },
  setsearchGirl(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  },
  searchNoPass(id, actionType, data) {
    this.searchQuery(id, actionType, data, 'searchNoPass');
  },
  setsearchNoPass(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  }
}