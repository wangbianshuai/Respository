using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageUser;
using Marriage.Entity.Application.MarriageUser2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲人员
    /// </summary>
    public class MarriageUser2 : BaseAction, IMarriageUser2
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }

        public Domain.IUserConditionType _UserConditionType { get; set; }

        public Domain.IConditionType _ConditionType { get; set; }

        /// <summary>
        /// 获取用户下用户信息
        /// </summary>
        public GetUserByUserResponse GetUserByUser(GetUserByUserRequest request)
        {
            string title = "获取用户下用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetUserByUserResponse response = new GetUserByUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            Entity.Domain.MarriageUser user = null;

            if (request.Type == 1) user = GetMarriageSquareUserByUserId(stepNo, request.LoginUserId, request.UserId, response);
            else if (request.Type == 2) user = GetMarriageArrangeUserByUserId(stepNo, request.LoginUserId, request.UserId, response);

            //2、获取用户信息
            stepNo += 1;
            GetUserByUser(stepNo, user, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserByUserResponse>(title, "GetUserByUser", requestContent, response);
        }

        /// <summary>
        /// 获取用户下用户条件类型
        /// </summary>
        public GetUserConditionTypeByUserResponse GetUserConditionTypeByUser(GetUserConditionTypeByUserRequest request)
        {
            string title = "获取用户下用户条件类型";
            string requestContent = Utility.Common.ToJson(request);
            GetUserConditionTypeByUserResponse response = new GetUserConditionTypeByUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            Entity.Domain.MarriageUser user = null;

            if (request.Type == 1) user = GetMarriageSquareUserByUserId(stepNo, request.LoginUserId, request.UserId, response);
            else if (request.Type == 2) user = GetMarriageArrangeUserByUserId(stepNo, request.LoginUserId, request.UserId, response);

            //3、获取条件类型
            stepNo += 1;
            GetConditionType(stepNo, request.ConditionTypeId, response);

            //4、获取用户条件类型
            stepNo += 1;
            GetUserConditionTypeByUser(stepNo, user, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserConditionTypeByUserResponse>(title, "GetUserConditionTypeByUser", requestContent, response);
        }

        /// <summary>
        /// 获取用户下用户条件类型列表
        /// </summary>
        public GetUserConditionTypesByUserResponse GetUserConditionTypesByUser(GetUserConditionTypesByUserRequest request)
        {
            string title = "获取用户下用户条件类型列表";
            string requestContent = Utility.Common.ToJson(request);
            GetUserConditionTypesByUserResponse response = new GetUserConditionTypesByUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            Entity.Domain.MarriageUser user = null;

            if (request.Type == 1) user = GetMarriageSquareUserByUserId(stepNo, request.LoginUserId, request.UserId, response);
            else if (request.Type == 2) user = GetMarriageArrangeUserByUserId(stepNo, request.LoginUserId, request.UserId, response);

            //2、获取用户条件类型列表
            stepNo += 1;
            GetUserConditionTypesByUser(stepNo, user, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserConditionTypesByUserResponse>(title, "GetUserConditionTypesByUser", requestContent, response);
        }

        /// <summary>
        /// 获取用户下用户信息
        /// </summary>
        public GetUserInfoByUserResponse GetUserInfoByUser(GetUserInfoByUserRequest request)
        {
            string title = "获取用户下用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetUserInfoByUserResponse response = new GetUserInfoByUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            Entity.Domain.MarriageUser user = null;

            if (request.Type == 1) user = GetMarriageSquareUserByUserId(stepNo, request.LoginUserId, request.UserId, response);
            else if (request.Type == 2) user = GetMarriageArrangeUserByUserId(stepNo, request.LoginUserId, request.UserId, response);

            //2、获取用户信息
            stepNo += 1;
            GetUserInfoByIdAndUserId(stepNo, user, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserInfoByUserResponse>(title, "GetUserInfo", requestContent, response);
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoByIdAndUserId(int stepNo, Entity.Domain.MarriageUser entity, GetUserInfoByUserResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                if (entity != null)
                {
                    if (entity.MarriageArrangeStatus == 3 || entity.MarriageArrangeStatus == 4 || entity.MarriageArrangeStatus == 5)
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
                            Phone = entity.Phone,
                            Province = entity.Province,
                            Remark = entity.Remark,
                            Sex = entity.Sex,
                            Status = entity.Status,
                            UserId = entity.UserId
                        };
                    }
                    else
                    {
                        response.UserInfo = new UserInfo()
                        {
                            City = entity.City,
                            HeadImgUrl = entity.HeadImgUrl,
                            Name = entity.Name,
                            NickName = entity.NickName,
                            Province = entity.Province,
                            Remark = entity.Remark,
                            Sex = entity.Sex,
                            UserId = entity.UserId
                        };
                    }
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoByIdAndMatchmaker", response, execStep);
        }


        /// <summary>
        /// 获取用户条件类型列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.ViewUserConditionType> GetUserConditionTypesByUser(int stepNo, Entity.Domain.MarriageUser user, GetUserConditionTypesByUserRequest request, GetUserConditionTypesByUserResponse response)
        {
            Func<List<Entity.Domain.ViewUserConditionType>> execStep = () =>
            {

                var list = _UserConditionType.GetUserConditionTypeList(user.UserId, request.SelectType);

                response.DataList = (from a in list
                                     where a.IsPublic == 1 || user.MarriageArrangeStatus == 3 || user.MarriageArrangeStatus == 4 || user.MarriageArrangeStatus == 5
                                     select new UserConditionType()
                                     {
                                         ConditionTypeId = a.ConditionTypeId,
                                         ConditionTypeName = a.ConditionTypeName,
                                         UserConditionTypeId = a.UserConditionTypeId,
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
        private Entity.Domain.UserConditionType GetUserConditionTypeByUser(int stepNo, Entity.Domain.MarriageUser user, GetUserConditionTypeByUserRequest request, GetUserConditionTypeByUserResponse response)
        {
            Func<Entity.Domain.UserConditionType> execStep = () =>
            {
                var entity = _UserConditionType.GetUserConditionTypeById(request.ConditionTypeId, request.UserConditionTypeId, user.Sex, request.SelectType);

                if (entity != null && (entity.IsPublic == 1 || user.MarriageArrangeStatus == 3 || user.MarriageArrangeStatus == 4 || user.MarriageArrangeStatus == 5))
                {
                    response.ConditionTypeId = entity.ConditionTypeId;
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
        /// 获取相亲广场用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetMarriageSquareUserByUserId(int stepNo, string loginUserId, Guid userId, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                return _MarriageUser.GetMarriageSquareUserByUserId(Guid.Parse(loginUserId), userId);
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "获取相亲广场用户信息", "GetMarriageSquareUserByUserId", response, execStep);
        }

        /// <summary>
        /// 获取相亲安排用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="loginUserId"></param>
        /// <param name="userId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetMarriageArrangeUserByUserId(int stepNo, string loginUserId, Guid userId, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                return _MarriageUser.GetMarriageArrangeUserByUserId(Guid.Parse(loginUserId), userId);
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "获取相亲安排用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="entity"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserByUser(int stepNo, Entity.Domain.MarriageUser entity, GetUserByUserResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                if (entity != null)
                {
                    response.UserInfo = new MarriageUser4()
                    {
                        HeadImgUrl = entity.HeadImgUrl,
                        NickName = entity.NickName,
                        Remark = entity.Remark,
                        Sex = entity.Sex,
                        Age = DateTime.Now.Year - entity.Birthday.Year,
                        RoseCount = entity.RoseCount,
                        RoseCount2 = entity.RoseCount2,
                        UserId = entity.UserId
                    };
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "获取用户信息", "GetUserByUser", response, execStep);
        }
    }
}
