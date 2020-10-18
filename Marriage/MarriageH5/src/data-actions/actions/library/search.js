export default {
  searchKeyword(id, actionType, data) {
    const { WhereFields } = data.queryInfo;
    WhereFields.push({
      Name: 'KeyWords',
      Value: data.pageData.keyword
    })
    this.searchQuery(id, actionType, data);
  },
  setsearchKeyword(id, actionType, data) {
    this.setsearchQuery(id, actionType, data)
  },
}