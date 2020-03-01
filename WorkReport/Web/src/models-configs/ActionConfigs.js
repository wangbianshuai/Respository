export default {
  GetWeeks: get("GetWeeks", "ViewWeek?$select=Id,WeekName&$orderby=StartDate desc", "Weeks", "ViewWeek"),
  GetStorys: get("GetStorys", "ViewStory?$select=Id,StoryName&$orderby=CreateDate desc", "Storys", "ViewStory"),
  GetUsers: get("GetUsers", "ViewUser?$select=UserId,UserName&$orderby CreateDate", "Users", "ViewUser")
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}
