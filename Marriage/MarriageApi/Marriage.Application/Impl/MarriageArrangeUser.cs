using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageArrangeUser;
using Marriage.Entity.Application.MarriageUser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲安排用户
    /// </summary>
    public class MarriageArrangeUser : BaseAction, IMarriageArrangeUser
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }
        public Domain.IMarriageArrange _MarriageArrange { get; set; }
        public Domain.IMatchmaker _Matchmaker { get; set; }

        public Domain.IConditionType _ConditionType { get; set; }

        public Domain.IUserConditionType _UserConditionType { get; set; }

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        public GetMarriageArrangeUserByMatchmakerResponse GetUserByMatchmaker(GetMarriageArrangeUserByMatchmakerRequest request)
        {
            string title = "获取红娘下用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageArrangeUserByMatchmakerResponse response = new GetMarriageArrangeUserByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、以主键获取红娘信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
            stepNo += 1;
            var marriageArrange = GetMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、获取用户信息
            stepNo += 1;
            GetUserByMatchmaker(stepNo, marriageArrange, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageArrangeUserByMatchmakerResponse>(title, "GetUserByMatchmaker", requestContent, response);
        }

        /// <summary>
        /// 获取红娘下用户条件类型
        /// </summary>
        public GetMarriageArrangeUserConditionTypeByMatchmakerResponse GetUserConditionTypeByMatchmaker(GetMarriageArrangeUserConditionTypeByMatchmakerRequest request)
        {
            string title = "获取红娘下用户条件类型";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageArrangeUserConditionTypeByMatchmakerResponse response = new GetMarriageArrangeUserConditionTypeByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、以主键获取红娘信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
            stepNo += 1;
            var marriageArrange = GetMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、获取用户信息
            stepNo += 1;
            var user = GetUserInfoById(stepNo, request.UserId, response);

            //3、获取条件类型
            stepNo += 1;
            GetConditionType(stepNo, request.ConditionTypeId, response);

            //4、获取用户条件类型
            stepNo += 1;
            GetUserConditionTypeByMatchmaker(stepNo, marriageArrange, user, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageArrangeUserConditionTypeByMatchmakerResponse>(title, "GetUserConditionTypeByMatchmaker", requestContent, response);
        }

        /// <summary>
        /// 获取红娘下用户条件类型列表
        /// </summary>
        public GetMarriageArrangeUserConditionTypesByMatchmakerResponse GetUserConditionTypesByMatchmaker(GetMarriageArrangeUserConditionTypesByMatchmakerRequest request)
        {
            string title = "获取红娘下用户条件类型列表";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageArrangeUserConditionTypesByMatchmakerResponse response = new GetMarriageArrangeUserConditionTypesByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、以主键获取红娘信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
            stepNo += 1;
            var marriageArrange = GetMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、获取用户信息
            stepNo += 1;
            var user = GetUserInfoById(stepNo, request.UserId, response);

            //2、获取用户条件类型列表
            stepNo += 1;
            GetUserConditionTypesByMatchmaker(stepNo, marriageArrange, user, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageArrangeUserConditionTypesByMatchmakerResponse>(title, "GetUserConditionTypesByMatchmaker", requestContent, response);
        }

        /// <summary>
        /// 获取用户条件类型列表
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrange"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.ViewUserConditionType> GetUserConditionTypesByMatchmaker(int stepNo, Entity.Domain.MarriageArrange marriageArrange, Entity.Domain.MarriageUser user, GetMarriageArrangeUserConditionTypesByMatchmakerRequest request, GetMarriageArrangeUserConditionTypesByMatchmakerResponse response)
        {
            Func<List<Entity.Domain.ViewUserConditionType>> execStep = () =>
            {
                Guid loginUseId = Guid.Parse(request.LoginUserId);

                if (marriageArrange.AppMatchmakerId != loginUseId && marriageArrange.ManMatchmakerId != loginUseId && marriageArrange.WomanMatchmakerId != loginUseId) return null;

                bool isAppMatchmaker = marriageArrange.AppMatchmakerId == loginUseId;

                var list = _UserConditionType.GetUserConditionTypeList(user.UserId, request.SelectType);

                response.DataList = (from a in list
                                     where a.IsPublic == 1 || isAppMatchmaker
                                     select new UserConditionType()
                                     {
                                         ConditionTypeId = a.ConditionTypeId,
                                         ConditionTypeName = a.ConditionTypeName,
                                         Percentage = request.SelectType == 1 && isAppMatchmaker ? string.Format("完善：{0}%", user.Sex == 1 ? a.ManPercentage : a.WomanPercentage) : string.Empty,
                                         UserConditionTypeId = a.UserConditionTypeId,
                                         UserItemCount = request.SelectType == 2 && isAppMatchmaker ? string.Format("选择：{0}/{1}", user.Sex == 1 ? a.WomanUserItemCount : a.ManUserItemCount, user.Sex == 1 ? a.WomanItemCount : a.ManItemCount) : string.Empty
                                     }).ToList();

                return list;
            };

            return this.GetEntityDataList<Entity.Domain.ViewUserConditionType>(stepNo, "获取用户条件类型列表", "GetUserConditionTypes", response, execStep, false);
        }

        /// <summary>
        /// 获取红娘下用户信息
        /// </summary>
        public GetMarriageArrangeUserInfoByMatchmakerResponse GetUserInfoByMatchmaker(GetMarriageArrangeUserInfoByMatchmakerRequest request)
        {
            string title = "获取红娘下用户信息";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageArrangeUserInfoByMatchmakerResponse response = new GetMarriageArrangeUserInfoByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、以主键获取红娘信息
            int stepNo = 1;
            this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
            stepNo += 1;
            var marriageArrange = GetMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、获取用户信息
            stepNo += 1;
            GetUserInfoByIdAndMatchmaker(stepNo, marriageArrange, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageArrangeUserInfoByMatchmakerResponse>(title, "GetUserInfo", requestContent, response);
        }

        /// <summary>
        /// 以主键获取相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrangeId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetMarriageArrange(int stepNo, Guid marriageArrangeId, IResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                return _MarriageArrange.GetMarriageArrange(marriageArrangeId);
            };

            return this.GetEntityData<Entity.Domain.MarriageArrange>(stepNo, "以主键获取相亲安排", "GetMarriageArrange", response, execStep);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoByIdAndMatchmaker(int stepNo, Entity.Domain.MarriageArrange marriageArrange, GetMarriageArrangeUserInfoByMatchmakerRequest request, GetMarriageArrangeUserInfoByMatchmakerResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                Guid loginUseId = Guid.Parse(request.LoginUserId);

                if (marriageArrange.AppMatchmakerId != loginUseId && marriageArrange.ManMatchmakerId != loginUseId && marriageArrange.WomanMatchmakerId != loginUseId) return null;

                bool isAppMatchmaker = marriageArrange.AppMatchmakerId == loginUseId;

                var entity = _MarriageUser.GetUserInfoById(request.UserId);

                if (entity != null)
                {
                    if (isAppMatchmaker)
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
                            BirthTime = -1
                        };
                    }
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoByIdAndMatchmaker", response, execStep);
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
        /// <param name="marriageArrange"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.UserConditionType GetUserConditionTypeByMatchmaker(int stepNo, Entity.Domain.MarriageArrange marriageArrange, Entity.Domain.MarriageUser user, GetMarriageArrangeUserConditionTypeByMatchmakerRequest request, GetMarriageArrangeUserConditionTypeByMatchmakerResponse response)
        {
            Func<Entity.Domain.UserConditionType> execStep = () =>
            {
                Guid loginUseId = Guid.Parse(request.LoginUserId);

                if (marriageArrange.AppMatchmakerId != loginUseId && marriageArrange.ManMatchmakerId != loginUseId && marriageArrange.WomanMatchmakerId != loginUseId) return null;

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
        /// 获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrange"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserByMatchmaker(int stepNo, Entity.Domain.MarriageArrange marriageArrange, GetMarriageArrangeUserByMatchmakerRequest request, GetMarriageArrangeUserByMatchmakerResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {

                Guid loginUseId = Guid.Parse(request.LoginUserId);

                if (marriageArrange.AppMatchmakerId != loginUseId && marriageArrange.ManMatchmakerId != loginUseId && marriageArrange.WomanMatchmakerId != loginUseId) return null;

                bool isAppMatchmaker = marriageArrange.AppMatchmakerId == loginUseId;

                var entity = _MarriageUser.GetUserInfoById(request.UserId);

                if (entity != null)
                {
                    response.UserInfo = new MarriageUser3()
                    {
                        HeadImgUrl = entity.HeadImgUrl,
                        NickName = entity.Name,
                        Age = DateTime.Now.Year - entity.Birthday.Year
                    };

                    if (isAppMatchmaker)
                    {
                        response.UserInfo.Phone = entity.Phone;
                        response.SelectLover = "SelectLove";
                    }
                    else response.UserInfo.Remark = entity.Remark;
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "获取用户信息", "GetUserByMatchmaker", response, execStep);
        }

        /// <summary>
        /// 以主键获取用户信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageUser GetUserInfoById(int stepNo, Guid userId, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                return _MarriageUser.GetUserInfoById(userId);
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep);
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
    }
}
