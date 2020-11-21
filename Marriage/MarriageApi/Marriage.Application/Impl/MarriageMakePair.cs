using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageMakePair;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲匹配
    /// </summary>
    public class MarriageMakePair : BaseAction, IMarriageMakePair
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }

        public Domain.IUserConditionType _UserConditionType { get; set; }

        public Domain.IDataSource _DataSource { get; set; }

        public Domain.IMarriageMakePair _MarriageMakePair { get; set; }

        /// <summary>
        /// 计算相亲匹配
        /// </summary>
        public ComputeMarriageMakePairResponse ComputeMarriageMakePair(ComputeMarriageMakePairRequest request)
        {
            string title = "计算相亲匹配";
            string requestContent = Utility.Common.ToJson(request);
            ComputeMarriageMakePairResponse response = new ComputeMarriageMakePairResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            List<Entity.Domain.MarriageUser> userList = this.GetMarriageMakePairUsers(stepNo, response);

            //2、获取条件类型
            stepNo += 1;
            List<Entity.Domain.UserConditionType> userConditionTypeList = this.GetUserConditionTypes(stepNo, response);

            //3、获取数据源
            stepNo += 1;
            List<Entity.Domain.DataSource> dataSourceList = this.GetDataSources(stepNo, response);

            //4、获取已匹配列表
            stepNo += 1;
            List<Entity.Domain.MarriageMakePair2> marriageMakePairList = this.GetMarriageMakePairUserList(stepNo, response);

            List<Dictionary<string, object>> makePairList = new List<Dictionary<string, object>>();
            List<Dictionary<string, object>> makePairDetaiList = new List<Dictionary<string, object>>();

            //4、计算相亲匹配
            stepNo += 1;
            ComputeMarriageMakePair(stepNo, userList, userConditionTypeList, dataSourceList, marriageMakePairList, makePairList, makePairDetaiList, response);

            //5、保存匹配结果
            stepNo += 1;
            SaveMarriageMakePairList(stepNo, makePairList, makePairDetaiList, response);

            //6、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<ComputeMarriageMakePairResponse>(title, "ComputeMarriageMakePair", requestContent, response);
        }

        private bool ComputeMarriageMakePair(int stepNo, List<Entity.Domain.MarriageUser> userList, List<Entity.Domain.UserConditionType> userConditionTypeList,
             List<Entity.Domain.DataSource> dataSourceList, List<Entity.Domain.MarriageMakePair2> marriageMakePairList,
            List<Dictionary<string, object>> makePairList, List<Dictionary<string, object>> makePairDetaiList, IResponse response)
        {
            Func<bool> execStep = () =>
            {
                setSelecItemDataSourceValue(userConditionTypeList, dataSourceList);
                userList.ForEach(d =>
                {
                    ComputeUserMarriageMakePair(d, userList, userConditionTypeList, marriageMakePairList, makePairList, makePairDetaiList);
                });
                return true;
            };

            return this.ExecSetData(stepNo, "计算相亲匹配", "ComputeMarriageMakePair", response, execStep);
        }

        void setSelecItemDataSourceValue(List<Entity.Domain.UserConditionType> userConditionTypeList, List<Entity.Domain.DataSource> dataSourceList)
        {
            userConditionTypeList.ForEach(c =>
            {
                c.UserSelectItems1.ForEach(item => GetDatSourceValue(item, dataSourceList));
                c.UserSelectItems2.ForEach(item => GetDatSourceValue(item, dataSourceList));
            });
        }

        void GetDatSourceValue(Entity.Domain.UserConditionSelectValue item, List<Entity.Domain.DataSource> dataSourceList)
        {
            if (string.IsNullOrEmpty(item.Value) || item.DataSourceId == Guid.Empty) return;

            var dataSource = dataSourceList.Where(w => w.DataSourceId == item.DataSourceId).FirstOrDefault();
            if (dataSource == null) return;

            if (!item.Value.StartsWith("["))
            {
                var dataSourceItem = dataSource.Items.Where(w => w.Value == item.Value).FirstOrDefault();
                if (dataSourceItem != null) item.Value = dataSourceItem.Name;
                return;
            }

            try
            {
                List<string> valueList = Utility.Common.JsonToObject<List<string>>(item.Value);

                valueList = (from a in valueList
                             from b in dataSource.Items
                             where a == b.Value
                             select b.Name).ToList();

                item.ValueList = valueList;
                item.Value = string.Join(",", valueList);
            }
            catch
            {

            }
        }

        /// <summary>
        /// 计算用户匹配
        /// </summary>
        /// <param name="user"></param>
        /// <param name="userList"></param>
        /// <param name="userConditionTypeList"></param>
        /// <param name="marriageMakePairList"></param>
        /// <param name="makePairList"></param>
        /// <param name="makePairDetaiList"></param>
        /// <param name="response"></param>
        private void ComputeUserMarriageMakePair(Entity.Domain.MarriageUser user, List<Entity.Domain.MarriageUser> userList, List<Entity.Domain.UserConditionType> userConditionTypeList,
            List<Entity.Domain.MarriageMakePair2> marriageMakePairList, List<Dictionary<string, object>> makePairList, List<Dictionary<string, object>> makePairDetaiList)
        {
            userList.ForEach(d =>
            {
                ComputeUserToUserMarriageMakePair(user, d, userConditionTypeList, marriageMakePairList, makePairList, makePairDetaiList);
            });
        }


        /// <summary>
        /// 计算两个人匹配
        /// </summary>
        /// <param name="self"></param>
        /// <param name="user"></param>
        /// <param name="userConditionTypeList"></param>
        /// <param name="dataSourceList"></param>
        /// <param name="marriageMakePairList"></param>
        /// <param name="makePairList"></param>
        /// <param name="makePairDetaiList"></param>
        private void ComputeUserToUserMarriageMakePair(Entity.Domain.MarriageUser self, Entity.Domain.MarriageUser user, List<Entity.Domain.UserConditionType> userConditionTypeList,
            List<Entity.Domain.MarriageMakePair2> marriageMakePairList, List<Dictionary<string, object>> makePairList, List<Dictionary<string, object>> makePairDetaiList)
        {
            //1、自己跳过
            if (self.UserId == user.UserId) return;

            //2、同性跳过
            if (self.Sex == user.Sex) return;

            //3、已安排相亲
            if (self.Sex == 1)
            {
                var makePair = marriageMakePairList.Where(w => w.ManUserId == self.UserId && w.WomanUserId == user.UserId).FirstOrDefault();
                if (makePair != null) return;
            }
            else
            {
                var makePair = marriageMakePairList.Where(w => w.ManUserId == user.UserId && w.WomanUserId == self.UserId).FirstOrDefault();
                if (makePair != null) return;
            }

            var list = (from a in userConditionTypeList
                        from b in userConditionTypeList
                        where a.UserId == self.UserId && b.UserId == user.UserId && a.ConditionTypeId == b.ConditionTypeId
                        select new { a, b });

            Dictionary<string, object> makePairDict = new Dictionary<string, object>();
            makePairDict.Add("MakePairId", Guid.NewGuid());
            makePairDict.Add("UserId", self.UserId);
            makePairDict.Add("OtherSideUserId", user.UserId);

            List<Dictionary<string, object>> detailList = new List<Dictionary<string, object>>();

            foreach (var c in list)
            {
                ComputeUserToUserConditionTypeMarriageMakePair(c.a, c.b, makePairDict, detailList);
            }

            decimal percentValue = detailList.Sum(s => s.GetValue<decimal>("PercentValue"));
            percentValue = Math.Round(percentValue / ((decimal)detailList.Count), 1);

            if (percentValue > 20)
            {
                makePairDict.Add("PercentValue", percentValue);
                makePairList.Add(makePairDict);
                makePairDetaiList.AddRange(detailList);
            }
        }
        void ComputeUserToUserConditionTypeMarriageMakePair(Entity.Domain.UserConditionType selfConditionType, Entity.Domain.UserConditionType userConditionType, Dictionary<string, object> makePair, List<Dictionary<string, object>> detailList)
        {
            Guid makePairId = makePair.GetValue<Guid>("MakePairId");

            selfConditionType.UserSelectItems2.ForEach(s =>
            {
                var userItem = userConditionType.UserSelectItems1.Where(w => w.ItemId == s.ItemId).FirstOrDefault();
                detailList.Add(ComputeUserToUserConditionItemMarriageMakePair(makePairId, selfConditionType, s, userItem));
            });
        }

        Dictionary<string, object> ComputeUserToUserConditionItemMarriageMakePair(Guid makePairId, Entity.Domain.UserConditionType selfConditionType,
             Entity.Domain.UserConditionSelectValue selfSelectValue, Entity.Domain.UserConditionSelectValue userSelectValue)
        {
            Dictionary<string, object> detail = new Dictionary<string, object>();

            detail.Add("DetailId", Guid.NewGuid());
            detail.Add("MakePairId", makePairId);
            detail.Add("ConditionTypeId", selfConditionType.ConditionTypeId);
            detail.Add("ConditionTypeName", selfConditionType.ConditionTypeName);
            detail.Add("ConditionItemId", selfSelectValue.ItemId);
            detail.Add("ConditionItemTitle", selfSelectValue.Title);
            detail.Add("SelfSelectValue", selfSelectValue.Value);
            detail.Add("OtherSideSelectValue", userSelectValue==null?string.Empty: userSelectValue.Value);
            detail.Add("PercentValue", userSelectValue == null ? 0 : ComputePercentValue(selfSelectValue, userSelectValue));

            return detail;
        }

        decimal ComputePercentValue(Entity.Domain.UserConditionSelectValue selfSelectValue, Entity.Domain.UserConditionSelectValue userSelectValue)
        {
            if (string.IsNullOrEmpty(selfSelectValue.Value) || string.IsNullOrEmpty(userSelectValue.Value)) return 0;

            //单选
            if (selfSelectValue.IsSingle == 1 && selfSelectValue.ValueList != null)
            {
                if (selfSelectValue.ValueList.Exists(e => e == userSelectValue.Value)) return 100;
            }
            else if (selfSelectValue.ValueList != null)
            {
                if (userSelectValue.ValueList == null) return 0;

                var list = (from a in selfSelectValue.ValueList
                            from b in userSelectValue.ValueList
                            where a == b
                            select a).ToList();
                if (list.Count == selfSelectValue.ValueList.Count) return 100;

                return Math.Round(((decimal)list.Count / (decimal)selfSelectValue.ValueList.Count) * 100, 1);
            }
            else if (selfSelectValue.DataType == "number" || selfSelectValue.IsInterval == 1)
            {
                var vs = selfSelectValue.Value.Split(",");
                decimal minValue = 0;
                decimal maxValue = 0;
                decimal.TryParse(vs[0], out minValue);
                if (vs.Length > 1) decimal.TryParse(vs[1], out maxValue);

                if (selfSelectValue.IsInterval == 1)
                {
                    var vs2 = userSelectValue.Value.Split(",");
                    decimal minValue2 = 0;
                    decimal maxValue2 = 0;
                    decimal.TryParse(vs2[0], out minValue2);
                    if (vs2.Length > 1) decimal.TryParse(vs2[1], out maxValue2);

                    if (minValue2 >= minValue && maxValue2 <= maxValue) return 100;

                    decimal min = minValue2 >= minValue ? minValue2 : minValue;
                    decimal max = maxValue2 >= maxValue ? maxValue : maxValue2;

                    decimal pv = 0;
                    if (maxValue == minValue || maxValue2 == minValue2)
                    {
                        if (minValue >= minValue2 && minValue <= maxValue2 && maxValue2 != minValue2) pv = (minValue - minValue2) / (maxValue2 - minValue2);
                        else if (minValue2 > minValue && minValue2 <= maxValue && maxValue != minValue) pv = (minValue2 - minValue) / (maxValue - minValue);
                        else pv = 0;
                    }
                    else pv = (max - min) / (maxValue - minValue);
                    if (pv <= 0) return 0;

                    return Math.Round(pv * 100, 1);
                }
                else
                {
                    decimal userNum = 0;
                    decimal.TryParse(userSelectValue.Value, out userNum);

                    if (userNum == 0) return 0;

                    if (maxValue >= userNum && minValue <= userNum) return 100;
                    return 0;
                }
            }
            else
            {
                var strs = selfSelectValue.Value.Split(new char[] { ',', '，', '、', ';', '；' });
                decimal count = 0;
                strs.ToList().ForEach(s =>
                {
                    count += userSelectValue.Value.Contains(s) ? 1 : 0;
                });

                return Math.Round((count / (decimal)strs.Length) * 100, 1);
            }

            return 0;
        }

        /// <summary>
        /// 保存匹配结果
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="makePairList"></param>
        /// <param name="makePairDetaiList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool SaveMarriageMakePairList(int stepNo, List<Dictionary<string, object>> makePairList, List<Dictionary<string, object>> makePairDetaiList, IResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (makePairList.Count == 0) return true;
                _MarriageMakePair.BulkCopyInsert(makePairList, makePairDetaiList);
                return true;
            };

            return this.InsertEntityData(stepNo, "保存匹配结果", "SaveMarriageMakePairList", response, execStep);
        }

        /// <summary>
        /// 获取已匹配列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageMakePair2> GetMarriageMakePairUserList(int stepNo, IResponse response)
        {
            Func<List<Entity.Domain.MarriageMakePair2>> execStep = () =>
            {
                return _MarriageMakePair.GetMarriageMakePairUsers();
            };

            return this.GetEntityDataList<Entity.Domain.MarriageMakePair2>(stepNo, "获取已匹配列表", "GetMarriageMakePairUserList", response, execStep, false);
        }

        /// <summary>
        /// 获取数据源
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.DataSource> GetDataSources(int stepNo, IResponse response)
        {
            Func<List<Entity.Domain.DataSource>> execStep = () =>
            {
                return _DataSource.GetDataSources();
            };

            return this.GetEntityDataList<Entity.Domain.DataSource>(stepNo, "获取数据源", "GetDataSources", response, execStep, false);
        }

        /// <summary>
        /// 获取条件类型
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.UserConditionType> GetUserConditionTypes(int stepNo, IResponse response)
        {
            Func<List<Entity.Domain.UserConditionType>> execStep = () =>
            {
                return _UserConditionType.GetUserConditionTypes();
            };

            return this.GetEntityDataList<Entity.Domain.UserConditionType>(stepNo, "获取条件类型", "GetUserConditionTypes", response, execStep);
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageUser> GetMarriageMakePairUsers(int stepNo, IResponse response)
        {
            Func<List<Entity.Domain.MarriageUser>> execStep = () =>
            {
                return _MarriageUser.GetMarriageMakePairUsers();
            };

            return this.GetEntityDataList<Entity.Domain.MarriageUser>(stepNo, "获取用户信息", "GetMarriageMakePairUsers", response, execStep);
        }

    }
}
