using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageUser;
using Marriage.Entity.Application.WxUser;
using OpenDataAccessCore.Utility;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public class MarriageUser : BaseAction, IMarriageUser
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }

        public Domain.IDictionaryConfig _DictionaryConfig { get; set; }

        public Domain.IUserConditionType _UserConditionType { get; set; }

        public Domain.IConditionType _ConditionType { get; set; }

        public Domain.IMatchmaker _Matchmaker { get; set; }

        /// <summary>
        /// 以微信OpenId获取用户
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>

        public GetUserByOpenIdResponse GetUserByOpenId(GetUserByOpenIdRequest request)
        {
            string title = "以微信OpenId获取用户";
            string requestContent = Utility.Common.ToJson(request);
            GetUserByOpenIdResponse response = new GetUserByOpenIdResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateGetUserByOpenId(stepNo, request, response);

            //2、以微信OpenId获取用户
            stepNo += 1;
            GetUserByOpenId(stepNo, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserByOpenIdResponse>(title, "GetUserByOpenId", requestContent, response);
        }

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public RegisterResponse Register(RegisterRequest request)
        {
            string title = "注册";
            string requestContent = Utility.Common.ToJson(request);
            RegisterResponse response = new RegisterResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateRegister(stepNo, request, response);

            //2、以获取集合获取键值配置集合
            List<string> nameList = new List<string>() { "DefaultMatchmakerId" };

            stepNo += 1;
            var dictionaryConfigList = GetDictionaryConfigListByNames(stepNo, nameList, response);

            //2、创建相亲用户
            stepNo += 1;
            CreateMarriageUser(stepNo, dictionaryConfigList, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<RegisterResponse>(title, "Register", requestContent, response);
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        public GetUserInfoResponse GetUserInfo(GetUserInfoRequest request)
        {
            string title = "获取用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetUserInfoResponse response = new GetUserInfoResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            GetUserInfoById(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserInfoResponse>(title, "GetUserInfo", requestContent, response);
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        public GetUserResponse GetUser(GetUserRequest request)
        {
            string title = "获取用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetUserResponse response = new GetUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            GetUserById(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserResponse>(title, "GetUser", requestContent, response);
        }

        /// <summary>
        /// 获取用户条件类型列表
        /// </summary>
        public GetUserConditionTypesResponse GetUserConditionTypes(GetUserConditionTypesRequest request)
        {
            string title = "获取用户条件类型列表";
            string requestContent = Utility.Common.ToJson(request);
            GetUserConditionTypesResponse response = new GetUserConditionTypesResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            var user = GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、获取用户条件类型列表
            stepNo += 1;
            GetUserConditionTypes(stepNo, user, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserConditionTypesResponse>(title, "GetUserConditionTypes", requestContent, response);
        }


        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoById(int stepNo, string userId, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                return _MarriageUser.GetUserInfoById(Guid.Parse(userId));
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 更新用户信息
        /// </summary>
        public UpdateUserInfoResponse UpdateUserInfo(UpdateUserInfoRequest request)
        {
            string title = "更新用户信息";
            string requestContent = Utility.Common.ToJson(request);
            UpdateUserInfoResponse response = new UpdateUserInfoResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateUpdateUserInfo(stepNo, request, response);

            //2、更新用户信息
            stepNo += 1;
            UpdateUserInfo(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<UpdateUserInfoResponse>(title, "UpdateUserInfo", requestContent, response);
        }


        /// <summary>
        /// 获取用户条件类型
        /// </summary>
        public GetUserConditionTypeResponse GetUserConditionType(GetUserConditionTypeRequest request)
        {
            string title = "获取用户条件类型";
            string requestContent = Utility.Common.ToJson(request);
            GetUserConditionTypeResponse response = new GetUserConditionTypeResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            var user = GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、获取条件类型
            stepNo += 1;
            GetConditionType(stepNo, request.ConditionTypeId, response);

            //3、获取用户条件类型
            stepNo += 1;
            GetUserConditionType(stepNo, user, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserConditionTypeResponse>(title, "GetUserConditionType", requestContent, response);
        }

        /// <summary>
        /// 保存用户条件类型
        /// </summary>
        public SaveUserConditionTypeResponse SaveUserConditionType(SaveUserConditionTypeRequest request)
        {
            string title = "保存用户条件类型";
            string requestContent = Utility.Common.ToJson(request);
            SaveUserConditionTypeResponse response = new SaveUserConditionTypeResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            var user = GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、获取条件类型
            stepNo += 1;
            GetConditionType(stepNo, request.ConditionTypeId, response);

            //3、保存用户条件类型
            stepNo += 1;
            SaveUserConditionType(stepNo, user, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<SaveUserConditionTypeResponse>(title, "SaveUserConditionType", requestContent, response);
        }

        /// <summary>
        /// 查询红娘下相亲人员列表
        /// </summary>
        public QueryUsersByMatchmakerResponse QueryUsersByMatchmaker(QueryUsersByMatchmakerRequest request)
        {
            string title = "查询红娘下相亲人员列表";
            string requestContent = Utility.Common.ToJson(request);
            QueryUsersByMatchmakerResponse response = new QueryUsersByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            Entity.Domain.Matchmaker matchmaker = this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、查询红娘下相亲人员列表
            stepNo += 1;
            QueryUsersByMatchmaker(stepNo, matchmaker, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<QueryUsersByMatchmakerResponse>(title, "QueryUsersByMatchmaker", requestContent, response);
        }

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        public GetUserByMatchmakerResponse GetUserByMatchmaker(GetUserByMatchmakerRequest request)
        {
            string title = "获取红娘下用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetUserByMatchmakerResponse response = new GetUserByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、以主键获取红娘信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取用户信息
            stepNo += 1;
            GetUserByMatchcmaker(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserByMatchmakerResponse>(title, "GetUserByMatchmaker", requestContent, response);
        }

        /// <summary>
        /// 获取红娘下用户条件类型
        /// </summary>
        public GetUserConditionTypeByMatchmakerResponse GetUserConditionTypeByMatchmaker(GetUserConditionTypeByMatchmakerRequest request)
        {
            string title = "获取红娘下用户条件类型";
            string requestContent = Utility.Common.ToJson(request);
            GetUserConditionTypeByMatchmakerResponse response = new GetUserConditionTypeByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、以主键获取红娘信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取用户信息
            stepNo += 1;
            var user = GetUserInfoById(stepNo, request.UserId.ToString(), response);

            //3、获取条件类型
            stepNo += 1;
            GetConditionType(stepNo, request.ConditionTypeId, response);

            //4、获取用户条件类型
            stepNo += 1;
            GetUserConditionTypeByMatchmaker(stepNo, user, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserConditionTypeByMatchmakerResponse>(title, "GetUserConditionTypeByMatchmaker", requestContent, response);
        }

        /// <summary>
        /// 获取红娘下用户条件类型列表
        /// </summary>
        public GetUserConditionTypesByMatchmakerResponse GetUserConditionTypesByMatchmaker(GetUserConditionTypesByMatchmakerRequest request)
        {
            string title = "获取红娘下用户条件类型列表";
            string requestContent = Utility.Common.ToJson(request);
            GetUserConditionTypesByMatchmakerResponse response = new GetUserConditionTypesByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、以主键获取红娘信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取用户信息
            stepNo += 1;
            var user = GetUserInfoById(stepNo, request.UserId.ToString(), response);

            //2、获取用户条件类型列表
            stepNo += 1;
            GetUserConditionTypesByMatchmaker(stepNo, user, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserConditionTypesByMatchmakerResponse>(title, "GetUserConditionTypesByMatchmaker", requestContent, response);
        }

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        public GetUserInfoByMatchmakerResponse GetUserInfoByMatchmaker(GetUserInfoByMatchmakerRequest request)
        {
            string title = "获取红娘下用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetUserInfoByMatchmakerResponse response = new GetUserInfoByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、以主键获取红娘信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取用户信息
            stepNo += 1;
           GetUserInfoByIdAndMatchmaker(stepNo, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserInfoByMatchmakerResponse>(title, "GetUserInfo", requestContent, response);
        }

        /// <summary>
        /// 更新红娘下用户状态
        /// </summary>
        public UpdateUserStatusByMatchmakerResponse UpdateUserStatusByMatchmaker(UpdateUserStatusByMatchmakerRequest request)
        {
            string title = "更新红娘下用户状态";
            string requestContent = Utility.Common.ToJson(request);
            UpdateUserStatusByMatchmakerResponse response = new UpdateUserStatusByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、验证数据
            int stepNo = 1;
            this.ValidateUpdateUserStatusByMatchmaker(stepNo, request, response);

            //2、以主键获取红娘信息
            stepNo += 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //3、获取用户信息
            stepNo += 1;
            var user = GetUserInfoById(stepNo, request.UserId.ToString(), response);

            //4、更新用户信息
            stepNo += 1;
            UpdateUserStatusByMatchmaker(stepNo, user, request, response);

            //5、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<UpdateUserStatusByMatchmakerResponse>(title, "UpdateUserStatusByMatchmaker", requestContent, response);
        }

        private bool UpdateUserStatusByMatchmaker(int stepNo, Entity.Domain.MarriageUser user, UpdateUserStatusByMatchmakerRequest request, UpdateUserStatusByMatchmakerResponse response)
        {
            Func<bool> execStep = () =>
            {
                Entity.Domain.MarriageUser entity = new Entity.Domain.MarriageUser();

                entity.Status = request.Status;
                entity.NoPassReason = request.NoPassReason;
                entity.UserId = request.UserId;

                return _MarriageUser.UpdateUserStatusByMatchmaker(entity);
            };

            return this.UpdateEntityData(stepNo, "更新用户信息", "UpdateUserInfo", response, execStep);
        }

        /// <summary>
        /// 获取用户条件类型列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.ViewUserConditionType> GetUserConditionTypesByMatchmaker(int stepNo, Entity.Domain.MarriageUser user, GetUserConditionTypesByMatchmakerRequest request, GetUserConditionTypesByMatchmakerResponse response)
        {
            Func<List<Entity.Domain.ViewUserConditionType>> execStep = () =>
            {

                var list = _UserConditionType.GetUserConditionTypeList(Guid.Parse(request.LoginUserId), request.SelectType);

                response.DataList = (from a in list
                                     select new UserConditionType()
                                     {
                                         ConditionTypeId = a.ConditionTypeId,
                                         ConditionTypeName = a.ConditionTypeName,
                                         Percentage = request.SelectType == 1 ? string.Format("完善：{0}%", user.Sex == 1 ? a.ManPercentage : a.WomanPercentage) : string.Empty,
                                         UserConditionTypeId = a.UserConditionTypeId,
                                         UserItemCount = request.SelectType == 2 ? string.Format("选择：{0}/{1}", user.Sex == 1 ? a.WomanUserItemCount : a.ManUserItemCount, user.Sex == 1 ? a.WomanItemCount : a.ManItemCount) : string.Empty
                                     }).ToList();

                return list;
            };

            return this.GetEntityDataList<Entity.Domain.ViewUserConditionType>(stepNo, "获取用户条件类型列表", "GetUserConditionTypes", response, execStep, false);
        }

        /// <summary>
        /// 获取用户条件类型
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.UserConditionType GetUserConditionTypeByMatchmaker(int stepNo, Entity.Domain.MarriageUser user, GetUserConditionTypeByMatchmakerRequest request, GetUserConditionTypeByMatchmakerResponse response)
        {
            Func<Entity.Domain.UserConditionType> execStep = () =>
            {
                var entity = _UserConditionType.GetUserConditionTypeById(request.ConditionTypeId, request.UserConditionTypeId, user.Sex, request.SelectType);

                if (entity != null)
                {
                    response.ConditionTypeId = entity.ConditionTypeId;
                    response.IsPublic = entity.IsPublic;
                    response.UserConditionTypeId = entity.UserConditionTypeId;
                    if (entity.Items != null)
                    {
                        response.Items = (from a in entity.Items
                                          select new ConditionItem()
                                          {
                                              DataSourceItems = GetDataSourceItems(a.DataSourceItems),
                                              DataType = a.DataType,
                                              DisplayIndex = a.DisplayIndex,
                                              IsInterval = a.IsInterval,
                                              IsSingle = a.IsSingle,
                                              ItemId = a.ItemId,
                                              Title = a.Title,
                                              IsReadOnly = true,
                                              Value = a.Value
                                          }).ToList();
                    }
                }
                return entity;
            };

            return this.GetEntityData<Entity.Domain.UserConditionType>(stepNo, "获取用户条件类型", "GetUserConditionType", response, execStep);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoByIdAndMatchmaker(int stepNo, Guid userId, string matchmakerId, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                var entity = _MarriageUser.GetUserInfoById(userId);
                if (entity != null && entity.MatchmakerId != Guid.Parse(matchmakerId)) return null;
                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 查询红娘下相亲人员列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="matchmaker"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageUser> QueryUsersByMatchmaker(int stepNo, Entity.Domain.Matchmaker matchmaker, QueryUsersByMatchmakerRequest request, QueryUsersByMatchmakerResponse response)
        {
            if (matchmaker == null) return null;

            Func<List<Entity.Domain.MarriageUser>> execStep = () =>
            {
                List<Entity.Domain.MarriageUser> dataList = null;

                if (request.PageIndex > 0 && request.PageSize > 0)
                {
                    Parallel.Invoke(() =>
                    {
                        dataList = _MarriageUser.QueryUsersByMatchmakerDataList(request);
                    },
                    () =>
                    {
                        response.PageInfo = _MarriageUser.QueryUsersByMatchmakerPageInfo(request);
                    });
                }
                else dataList = _MarriageUser.QueryUsersByMatchmakerDataList(request);

                if (dataList != null) response.DataList = (from a in dataList
                                                           select GetMarriageUser(a)).ToList();

                return dataList;
            };

            return this.GetEntityDataList<Entity.Domain.MarriageUser>(stepNo, "查询红娘下相亲人员列表", "QueryUsersByMatchmaker", response, execStep, false);
        }

        MarriageUser3 GetMarriageUser(Entity.Domain.MarriageUser user)
        {
            return new MarriageUser3()
            {
                Age = user.Age,
                HeadImgUrl = user.HeadImgUrl,
                NickName = user.NickName,
                Phone = user.Phone,
                Sex = user.Sex,
                UserId= user.UserId
            };
        }

        /// <summary>
        /// 以主键获取红娘信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="userId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Matchmaker GetMatchmakerById(int stepNo, string userId, IResponse response)
        {
            Func<Entity.Domain.Matchmaker> execStep = () =>
            {
                var entity = _Matchmaker.GetMatchmakerById(Guid.Parse(userId));
                if (entity == null || entity.Status != 1) return null;
                return entity;
            };

            return this.GetEntityData<Entity.Domain.Matchmaker>(stepNo, "以主键获取红娘信息", "GetMatchmakerInfoById", response, execStep, false);
        }

        /// <summary>
        /// 保存用户条件类型
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool SaveUserConditionType(int stepNo, Entity.Domain.MarriageUser user, SaveUserConditionTypeRequest request, SaveUserConditionTypeResponse response)
        {
            Func<bool> execStep = () =>
            {
                Entity.Domain.UserConditionType entity = new Entity.Domain.UserConditionType();
                entity.ConditionTypeId = request.ConditionTypeId;
                entity.IsPublic = request.IsPublic;
                entity.SelectType = request.SelectType;
                entity.UserConditionTypeId = request.UserConditionTypeId;
                entity.UserId = Guid.Parse(request.LoginUserId);
                entity.Items = (from a in request.Items
                                select new Entity.Domain.ConditionItem()
                                {
                                    ItemId = a.ItemId,
                                    Value = a.Value
                                }).ToList();
                return _UserConditionType.SaveUserConditionType(entity);
            };

            return this.UpdateEntityData(stepNo, "保存用户条件类型", "SaveUserConditionType", response, execStep);

        }
        /// <summary>
        /// 获取条件类型
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.ConditionType GetConditionType(int stepNo, Guid conditonTypeId, IResponse response)
        {
            Func<Entity.Domain.ConditionType> execStep = () =>
            {
                return _ConditionType.GetConditionTypeById(conditonTypeId);
            };

            return this.GetEntityData<Entity.Domain.ConditionType>(stepNo, "获取条件类型", "GetConditionType", response, execStep);
        }

        /// <summary>
        /// 获取用户条件类型
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.UserConditionType GetUserConditionType(int stepNo, Entity.Domain.MarriageUser user, GetUserConditionTypeRequest request, GetUserConditionTypeResponse response)
        {
            Func<Entity.Domain.UserConditionType> execStep = () =>
            {
                var entity = _UserConditionType.GetUserConditionTypeById(request.ConditionTypeId, request.UserConditionTypeId, user.Sex, request.SelectType);

                if (entity != null)
                {
                    response.ConditionTypeId = entity.ConditionTypeId;
                    response.IsPublic = entity.IsPublic;
                    response.UserConditionTypeId = entity.UserConditionTypeId;
                    if (entity.Items != null)
                    {
                        response.Items = (from a in entity.Items
                                          select new ConditionItem()
                                          {
                                              DataSourceItems = GetDataSourceItems(a.DataSourceItems),
                                              DataType = a.DataType,
                                              DisplayIndex = a.DisplayIndex,
                                              IsInterval = a.IsInterval,
                                              IsSingle = a.IsSingle,
                                              ItemId = a.ItemId,
                                              Title = a.Title,
                                              Value = a.Value
                                          }).ToList();
                    }
                }
                return entity;
            };

            return this.GetEntityData<Entity.Domain.UserConditionType>(stepNo, "获取用户条件类型", "GetUserConditionType", response, execStep);
        }

        List<DataSourceItem> GetDataSourceItems(List<Entity.Domain.DataSourceItem> items)
        {
            if (items == null || items.Count == 0) return null;

            return (from a in items
                    select new DataSourceItem()
                    {
                        text = a.Name,
                        value = a.Value
                    }).ToList();
        }

        /// <summary>
        /// 获取用户条件类型列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.ViewUserConditionType> GetUserConditionTypes(int stepNo, Entity.Domain.MarriageUser user, GetUserConditionTypesRequest request, GetUserConditionTypesResponse response)
        {
            Func<List<Entity.Domain.ViewUserConditionType>> execStep = () =>
            {

                var list = _UserConditionType.GetUserConditionTypeList(Guid.Parse(request.LoginUserId), request.SelectType);

                response.DataList = (from a in list
                                     select new UserConditionType()
                                     {
                                         ConditionTypeId = a.ConditionTypeId,
                                         ConditionTypeName = a.ConditionTypeName,
                                         Percentage = request.SelectType == 1 ? string.Format("完善：{0}%", user.Sex == 1 ? a.ManPercentage : a.WomanPercentage) : string.Empty,
                                         UserConditionTypeId = a.UserConditionTypeId,
                                         UserItemCount = request.SelectType == 2 ? string.Format("选择：{0}/{1}", user.Sex == 1 ? a.WomanUserItemCount : a.ManUserItemCount, user.Sex == 1 ? a.WomanItemCount : a.ManItemCount) : string.Empty
                                     }).ToList();

                return list;
            };

            return this.GetEntityDataList<Entity.Domain.ViewUserConditionType>(stepNo, "获取用户条件类型列表", "GetUserConditionTypes", response, execStep, false);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserById(int stepNo, GetUserRequest request, GetUserResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                var entity = _MarriageUser.GetUserInfoById(Guid.Parse(request.LoginUserId));

                if (entity != null)
                {
                    response.UserInfo = new UserInfo2()
                    {
                        HeadImgUrl = entity.HeadImgUrl,
                        NickName = entity.NickName,
                        Phone = entity.Phone
                    };

                    response.StatusInfo = new StatusInfo()
                    {
                        NoPassReason = entity.NoPassReason,
                        Status = entity.Status
                    };
                }
                else response.Token = "null";

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "获取用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserByMatchcmaker(int stepNo, GetUserByMatchmakerRequest request, GetUserByMatchmakerResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                var entity = _MarriageUser.GetUserInfoById(request.UserId);

                if (entity != null)
                {
                    if (entity.MatchmakerId != Guid.Parse(request.LoginUserId)) return null;

                    response.UserInfo = new MarriageUser3()
                    {
                        HeadImgUrl = entity.HeadImgUrl,
                        NickName = entity.NickName,
                        Phone = entity.Phone,
                        Sex = entity.Sex,
                        Age = DateTime.Now.Year - entity.Birthday.Year
                    };

                    response.StatusInfo = new StatusInfo()
                    {
                        NoPassReason = entity.NoPassReason,
                        Status = entity.Status
                    };
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "获取用户信息", "GetUserByMatchcmaker", response, execStep);
        }

        /// <summary>
        /// 以主键获取用户信息s
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoByIdAndMatchmaker(int stepNo, GetUserInfoByMatchmakerRequest request, GetUserInfoByMatchmakerResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                var entity = _MarriageUser.GetUserInfoById(request.UserId);

                if (entity != null)
                {
                    response.UserInfo = new UserInfo()
                    {
                        Address = entity.Address,
                        Birthday = entity.Birthday.ToString("yyyy-MM-dd"),
                        BirthEight = entity.BirthEight,
                        BirthTime = entity.BirthTime,
                        City = entity.City,
                        HeadImgUrl = entity.HeadImgUrl,
                        IdCard = entity.IdCard,
                        IsPublic = entity.IsPublic,
                        LunarBirthday = entity.LunarBirthday,
                        MatchmakerId = entity.MatchmakerId,
                        Name = entity.Name,
                        NickName = entity.NickName,
                        NoPassReason = entity.NoPassReason,
                        NowAddress = entity.NowAddress,
                        OpenId = entity.OpenId,
                        Phone = entity.Phone,
                        Province = entity.Province,
                        Remark = entity.Remark,
                        Sex = entity.Sex,
                        Status = entity.Status,
                        UserId = entity.UserId
                    };
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoByIdAndMatchmaker", response, execStep);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoById(int stepNo, GetUserInfoRequest request, GetUserInfoResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                var entity = _MarriageUser.GetUserInfoById(Guid.Parse(request.LoginUserId));

                if (entity != null)
                {
                    response.UserInfo = new UserInfo()
                    {
                        Address = entity.Address,
                        Birthday = entity.Birthday.ToString("yyyy-MM-dd"),
                        BirthEight = entity.BirthEight,
                        BirthTime = entity.BirthTime,
                        City = entity.City,
                        HeadImgUrl = entity.HeadImgUrl,
                        IdCard = entity.IdCard,
                        IsPublic = entity.IsPublic,
                        LunarBirthday = entity.LunarBirthday,
                        MatchmakerId = entity.MatchmakerId,
                        Name = entity.Name,
                        NickName = entity.NickName,
                        NoPassReason = entity.NoPassReason,
                        NowAddress = entity.NowAddress,
                        OpenId = entity.OpenId,
                        Phone = entity.Phone,
                        Province = entity.Province,
                        Remark = entity.Remark,
                        Sex = entity.Sex,
                        Status = entity.Status,
                        UserId = entity.UserId
                    };
                }
                else response.Token = "null";

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 创建相亲用户
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="dictionaryConfigList"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool CreateMarriageUser(int stepNo, List<Entity.Domain.DictionaryConfig> dictionaryConfigList, RegisterRequest request, RegisterResponse response)
        {
            Func<bool> execStep = () =>
            {
                Entity.Domain.MarriageUser entity = new Entity.Domain.MarriageUser();


                entity.Address = request.Address;
                entity.Birthday = request.Birthday;
                entity.BirthEight = request.BirthEight;
                entity.BirthTime = request.BirthTime;
                entity.City = request.City;
                entity.HeadImgUrl = request.HeadImgUrl;
                entity.IdCard = request.IdCard;
                entity.IsPublic = request.IsPublic;
                entity.LunarBirthday = request.LunarBirthday;
                entity.MatchmakerId = request.MatchmakerId;
                entity.Name = request.Name;
                entity.NickName = request.NickName;
                entity.NowAddress = request.NowAddress;
                entity.OpenId = request.OpenId;
                entity.Phone = request.Phone;
                entity.Province = request.Province;
                entity.Remark = request.Remark;
                entity.UserId = Guid.NewGuid();

                entity.Sex = (byte)(int.Parse(entity.IdCard.Substring(16, 1)) % 2 == 0 ? 2 : 1);
                if (entity.MatchmakerId == Guid.Empty)
                {
                    entity.MatchmakerId = new Guid(dictionaryConfigList[0].Value);
                }

                var id = _MarriageUser.CreateMarriageUser(entity);
                if (id != Guid.Empty)
                {
                    response.Token = entity.UserId.ToString();
                }

                return id != Guid.Empty;
            };

            return this.InsertEntityData(stepNo, "创建相亲用户", "CreateMarriageUser", response, execStep);
        }

        /// <summary>
        /// 更新用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateUserInfo(int stepNo, UpdateUserInfoRequest request, UpdateUserInfoResponse response)
        {
            Func<bool> execStep = () =>
            {
                Entity.Domain.MarriageUser entity = new Entity.Domain.MarriageUser();

                entity.Address = request.Address;
                entity.Birthday = request.Birthday;
                entity.BirthEight = request.BirthEight;
                entity.BirthTime = request.BirthTime;
                entity.City = request.City;
                entity.HeadImgUrl = request.HeadImgUrl;
                entity.IdCard = request.IdCard;
                entity.IsPublic = request.IsPublic;
                entity.LunarBirthday = request.LunarBirthday;
                entity.Name = request.Name;
                entity.NickName = request.NickName;
                entity.NowAddress = request.NowAddress;
                entity.Phone = request.Phone;
                entity.Province = request.Province;
                entity.Remark = request.Remark;
                entity.UserId = Guid.Parse(request.LoginUserId);

                entity.Sex = (byte)(int.Parse(entity.IdCard.Substring(16, 1)) % 2 == 0 ? 2 : 1);

                return _MarriageUser.UpdateMarriageUser(entity);
            };

            return this.UpdateEntityData(stepNo, "更新用户信息", "UpdateUserInfo", response, execStep);
        }
        
        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateRegister(int stepNo, RegisterRequest request, RegisterResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.Name)) this.SetValidateMessageRepsonse("姓名不能为空", response);
                else if (string.IsNullOrEmpty(request.NickName)) this.SetValidateMessageRepsonse("昵称不能为空", response);
                else if (string.IsNullOrEmpty(request.HeadImgUrl)) this.SetValidateMessageRepsonse("头像不能为空", response);
                else if (string.IsNullOrEmpty(request.IdCard)) this.SetValidateMessageRepsonse("身份证号不能为空", response);
                else if (string.IsNullOrEmpty(request.Phone)) this.SetValidateMessageRepsonse("手机号码不能为空", response);
                else if (string.IsNullOrEmpty(request.Address)) this.SetValidateMessageRepsonse("家庭地址不能为空", response);
                else if (string.IsNullOrEmpty(request.OpenId)) this.SetValidateMessageRepsonse("请使用微信打开或微信扫码授权", response);
                else if (request.Birthday == DateTime.MinValue) this.SetValidateMessageRepsonse("公历生日不能为空", response);

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateRegister", response, execStep);
        }

        /// <summary>
        /// 更新用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateUpdateUserInfo(int stepNo, UpdateUserInfoRequest request, UpdateUserInfoResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.Name)) this.SetValidateMessageRepsonse("姓名不能为空", response);
                else if (string.IsNullOrEmpty(request.NickName)) this.SetValidateMessageRepsonse("昵称不能为空", response);
                else if (string.IsNullOrEmpty(request.HeadImgUrl)) this.SetValidateMessageRepsonse("头像不能为空", response);
                else if (string.IsNullOrEmpty(request.IdCard)) this.SetValidateMessageRepsonse("身份证号不能为空", response);
                else if (string.IsNullOrEmpty(request.Phone)) this.SetValidateMessageRepsonse("手机号码不能为空", response);
                else if (string.IsNullOrEmpty(request.Address)) this.SetValidateMessageRepsonse("家庭地址不能为空", response);
                else if (request.Birthday == DateTime.MinValue) this.SetValidateMessageRepsonse("公历生日不能为空", response);

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateUpdateUserInfo", response, execStep);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateUpdateUserStatusByMatchmaker(int stepNo, UpdateUserStatusByMatchmakerRequest request, UpdateUserStatusByMatchmakerResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (request.Status == 2 && string.IsNullOrEmpty(request.NoPassReason)) this.SetValidateMessageRepsonse("审核不通过原因", response);
                else if (request.Status < 0 || request.Status > 2) this.SetValidateMessageRepsonse("未知状态", response);

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateUpdateUserStatusByMatchmaker", response, execStep);
        }

        /// <summary>
        /// 以微信OpenId获取用户
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="getAccessTokenResponse"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserByOpenId(int stepNo, GetUserByOpenIdRequest request, GetUserByOpenIdResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                var entity = _MarriageUser.GetUserByOpenId(request.OpenId);

                if (entity != null)
                {
                    response.Token = entity.UserId.ToString();
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以微信OpenId获取用户", "GetUserByOpenId", response, execStep, false);
        }

        /// <summary>
        /// 验证数据
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool ValidateGetUserByOpenId(int stepNo, GetUserByOpenIdRequest request, GetUserByOpenIdResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (string.IsNullOrEmpty(request.OpenId))
                {
                    this.SetValidateMessageRepsonse("OpenId不能为空", response);
                }

                return response.Ack.IsSuccess;
            };

            return this.ExecValidate(stepNo, "验证数据", "ValidateGetUserByOpenId", response, execStep);
        }

        /// <summary>
        /// 获取类型名称集合键值配置
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="nameList"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.DictionaryConfig> GetDictionaryConfigListByNames(int stepNo, List<string> nameList, IResponse response)
        {
            Func<List<Entity.Domain.DictionaryConfig>> execStep = () =>
            {
                return _DictionaryConfig.GetDictionaryConfigListByNames(nameList);
            };

            return this.GetEntityDataList<Entity.Domain.DictionaryConfig>(stepNo, "获取类型名称集合键值配置", "GetDictionaryConfigListByNames", response, execStep);
        }
    }
}
