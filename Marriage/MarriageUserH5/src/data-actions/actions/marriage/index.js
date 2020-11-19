export default {
  searchLike(id, actionType, data) {
    this.searchQuery(id, actionType, data, 'searchLike');
  },
  setsearchLike(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  },
  searchMarriage(id, actionType, data) {
    this.searchQuery(id, actionType, data, 'searchMarriage');
  },
  setsearchMarriage(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  },
  searchDislike(id, actionType, data) {
    this.searchQuery(id, actionType, data, 'searchDislike');
  },
  setsearchDislike(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  }
}