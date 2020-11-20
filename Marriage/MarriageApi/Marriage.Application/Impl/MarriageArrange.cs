using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageArrange;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲安排
    /// </summary>
    public class MarriageArrange : BaseAction, IMarriageArrange
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }
        public Domain.IMarriageArrange _MarriageArrange { get; set; }
        public Domain.IMatchmaker _Matchmaker { get; set; }

        /// <summary>
        /// 查询相亲安排
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public QueryMarriageArrangeResponse QueryMarriageArrange(QueryMarriageArrangeRequest request)
        {
            string title = "查询相亲安排";
            string requestContent = Utility.Common.ToJson(request);
            QueryMarriageArrangeResponse response = new QueryMarriageArrangeResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            Entity.Domain.MarriageUser user = this.GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、查询相亲安排
            stepNo += 1;
            QueryMarriageArrange(stepNo, user, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<QueryMarriageArrangeResponse>(title, "QueryMarriageArrange", requestContent, response);
        }

        /// <summary>
        /// 获取相亲安排
        /// </summary>
        public GetMarriageArrangeByUserResponse GetMarriageArrangeByUser(GetMarriageArrangeByUserRequest request)
        {
            string title = "获取相亲安排";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageArrangeByUserResponse response = new GetMarriageArrangeByUserResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取相亲安排
            int stepNo = 1;
            var marriageArrange = GetViewMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、以用户获取相亲安排
            stepNo += 1;
            GetMarriageArrangeByUser(stepNo, marriageArrange, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageArrangeByUserResponse>(title, "GetMarriageArrangeByUser", requestContent, response);

        }

        /// <summary>
        /// 查询红娘下相亲安排
        /// </summary>
        public QueryMarriageArrangeByMatchmakerResponse QueryMarriageArrangeByMatchmaker(QueryMarriageArrangeByMatchmakerRequest request)
        {
            string title = "查询红娘下相亲安排";
            string requestContent = Utility.Common.ToJson(request);
            QueryMarriageArrangeByMatchmakerResponse response = new QueryMarriageArrangeByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            Entity.Domain.Matchmaker matchmaker = this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、查询相亲安排
            stepNo += 1;
            QueryMarriageArrangeByMatchmaker(stepNo, matchmaker, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<QueryMarriageArrangeByMatchmakerResponse>(title, "QueryMarriageArrangeByMatchmaker", requestContent, response);
        }

        /// <summary>
        /// 获取红娘下相亲安排
        /// </summary>
        public GetMarriageArrangeByMatchmakerResponse GetMarriageArrangeByMatchmaker(GetMarriageArrangeByMatchmakerRequest request)
        {
            string title = "获取红娘下相亲安排";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageArrangeByMatchmakerResponse response = new GetMarriageArrangeByMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取红娘信息
            int stepNo = 1;
            Entity.Domain.Matchmaker matchmaker = this.GetMatchmakerById(stepNo, request.LoginUserId, response);

            //2、获取相亲安排
             stepNo += 1;
            var marriageArrange = GetMarriageArrange(stepNo, request.MarriageArrangeId, request.LoginUserId, response);

            //3、获取男方信息
            stepNo += 1;
            var manUser = GetUserInfoById(stepNo, marriageArrange, 1, response);

            //4、获取男方信息
            stepNo += 1;
            var womanUser = GetUserInfoById(stepNo, marriageArrange, 2, response);

            //2、获取红娘下相亲安排
            stepNo += 1;
            GetMarriageArrangeByMatchmaker(stepNo, matchmaker, marriageArrange, manUser, womanUser, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageArrangeByMatchmakerResponse>(title, "GetMarriageArrangeByMatchmaker", requestContent, response);
        }

        /// <summary>
        /// 获取相亲安排信息
        /// </summary>
        public GetMarriageArrangeByIdResponse GetMarriageArrangeById(GetMarriageArrangeByIdRequest request)
        {
            string title = "获取相亲安排信息";
            string requestContent = Utility.Common.ToJson(request);
            GetMarriageArrangeByIdResponse response = new GetMarriageArrangeByIdResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取相亲安排
            int stepNo = 1;
            var marriageArrange = GetViewMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、获取相亲安排信息
            stepNo += 1;
            GetMarriageArrangeById(stepNo, marriageArrange, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetMarriageArrangeByIdResponse>(title, "GetMarriageArrangeById", requestContent, response);
        }

        /// <summary>
        /// 更新相亲安排
        /// </summary>
        public UpdateMarriageArrangeResponse UpdateMarriageArrange(UpdateMarriageArrangeRequest request)
        {
            string title = "更新相亲安排";
            string requestContent = Utility.Common.ToJson(request);
            UpdateMarriageArrangeResponse response = new UpdateMarriageArrangeResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取相亲安排
            int stepNo = 1;
            var marriageArrange = GetViewMarriageArrange(stepNo, request.MarriageArrangeId, response);

            //2、更新相亲安排
            stepNo += 1;
            UpdateMarriageArrange(stepNo, marriageArrange, request, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<UpdateMarriageArrangeResponse>(title, "UpdateMarriageArrange", requestContent, response);
        }

        /// <summary>
        /// 更新相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="entity"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateMarriageArrange(int stepNo, Entity.Domain.MarriageArrange entity, UpdateMarriageArrangeRequest request, UpdateMarriageArrangeResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (entity != null)
                {
                    Guid loginUserId = Guid.Parse(request.LoginUserId);

                    if (entity.AppMatchmakerId != loginUserId) return false;
                   
                    Entity.Domain.MarriageArrange marriageArrange = new Entity.Domain.MarriageArrange();
                    marriageArrange.MarriageArrangeId = request.MarriageArrangeId;
                    marriageArrange.MarriageAddress = request.MarriageAddress;
                    marriageArrange.MarriageContent = request.MarriageContent;
                    marriageArrange.MarriageDate = request.MarriageDate;
                    marriageArrange.Remark = request.Remark;
                    marriageArrange.UpdateUser = loginUserId;

                    return _MarriageArrange.UpdateMarriageArrange(marriageArrange);
                }
                return false;
            };

            return this.UpdateEntityData(stepNo, "更新相亲安排", "UpdateMarriageArrange", response, execStep);
        }


        /// <summary>
        /// 获取相亲安排信息
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="entity"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetMarriageArrangeById(int stepNo, Entity.Domain.MarriageArrange entity, GetMarriageArrangeByIdRequest request, GetMarriageArrangeByIdResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                if (entity != null)
                {
                    Guid loginUserId = Guid.Parse(request.LoginUserId);

                    bool blSucceed = entity.AppMatchmakerId == loginUserId || entity.ManMatchmakerId == loginUserId || entity.WomanMatchmakerId == loginUserId;
                    if (!blSucceed) return null;

                    response.AppMatchmakerName = entity.AppMatchmakerName;
                    response.ManUserName = entity.ManUserName;
                    response.MarriageAddress = entity.MarriageAddress;
                    response.MarriageContent = entity.MarriageContent;
                    response.MarriageDate = entity.MarriageDate.ToString("yyyy-MM-dd");
                    response.WomanUserName = entity.WomanUserName;

                    if (entity.AppMatchmakerId == loginUserId)
                    {
                        response.MarriageArrangeId = entity.MarriageArrangeId;
                        response.Remark = entity.Remark;
                    }
                }
                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageArrange>(stepNo, "获取相亲安排信息", "GetMarriageArrangeById", response, execStep);
        }

        /// <summary>
        /// 获取红娘下相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="matchmaker"></param>
        /// <param name="entity"></param>
        /// <param name="manUser"></param>
        /// <param name="womanUser"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetMarriageArrangeByMatchmaker(int stepNo, Entity.Domain.Matchmaker matchmaker,
            Entity.Domain.MarriageArrange entity, Entity.Domain.MarriageUser manUser, Entity.Domain.MarriageUser womanUser, GetMarriageArrangeByMatchmakerResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                if (entity != null)
                {
                    bool isAppMatchmaker = matchmaker.MatchmakerId == entity.AppMatchmakerId;

                    response.ManUserInfo = new Entity.Application.MarriageUser.MarriageUser3()
                    {
                        Age = DateTime.Now.Year - manUser.Birthday.Year,
                        HeadImgUrl = manUser.HeadImgUrl,
                        NickName = manUser.NickName,
                        UserId = manUser.UserId
                    };

                    response.WomanUserInfo = new Entity.Application.MarriageUser.MarriageUser3()
                    {
                        Age = DateTime.Now.Year - womanUser.Birthday.Year,
                        HeadImgUrl = womanUser.HeadImgUrl,
                        NickName = womanUser.NickName,
                        UserId = womanUser.UserId
                    };

                    response.StatusInfo = new Entity.Application.MarriageUser.StatusInfo()
                    {
                        Status = entity.Status
                    };

                    if (isAppMatchmaker)
                    {
                        response.ManUserInfo.Phone = manUser.Phone;
                        response.WomanUserInfo.Phone = womanUser.Phone;
                        response.StatusInfo.IsEdit = true;

                        if (entity.ManMatchmakerId != matchmaker.MatchmakerId) response.ManMatchmaker = new MatchmakerInfo4()
                        {
                            MatchmakerId = entity.ManMatchmakerId,
                            Name = entity.ManMatchmakerName
                        };

                        if (entity.WomanMatchmakerId != matchmaker.MatchmakerId) response.WomanMatchmaker = new MatchmakerInfo4()
                        {
                            MatchmakerId = entity.WomanMatchmakerId,
                            Name = entity.WomanMatchmakerName
                        };

                        response.MarriageFee = entity.Amount.ToString("C");
                    }
                    else
                    {
                        response.ManUserInfo.Remark = manUser.Remark;
                        response.WomanUserInfo.Remark = womanUser.Remark;

                        response.AppMatchmaker = new MatchmakerInfo4()
                        {
                            MatchmakerId = entity.AppMatchmakerId,
                            Name = entity.AppMatchmakerName
                        };
                    }
                }
                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageArrange>(stepNo, "以用户获取相亲安排", "GetMarriageArrangeByMatchmaker", response, execStep);
        }

        /// <summary>
        /// 查询红娘下相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="matchmaker"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageArrange> QueryMarriageArrangeByMatchmaker(int stepNo, Entity.Domain.Matchmaker matchmaker, QueryMarriageArrangeByMatchmakerRequest request, QueryMarriageArrangeByMatchmakerResponse response)
        {
            if (matchmaker == null) return null;

            Func<List<Entity.Domain.MarriageArrange>> execStep = () =>
            {
                List<Entity.Domain.MarriageArrange> dataList = null;

                if (request.PageIndex > 0 && request.PageSize > 0)
                {
                    Parallel.Invoke(() =>
                    {
                        dataList = _MarriageArrange.QueryMarriageArrangeByMatchmakerDataList(request);
                    },
                    () =>
                    {
                        response.PageInfo = _MarriageArrange.QueryMarriageArrangeByMatchmakerPageInfo(request);
                    });
                }
                else dataList = _MarriageArrange.QueryMarriageArrangeByMatchmakerDataList(request);

                if (dataList != null) response.DataList = (from a in dataList
                                                           select GetMarriageArrangeInfo(a)).ToList();

                return dataList;
            };

            return this.GetEntityDataList<Entity.Domain.MarriageArrange>(stepNo, "查询红娘下相亲安排", "QueryMarriageArrangeByMatchmaker", response, execStep, false);
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
        /// 以用户获取相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrange"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetMarriageArrangeByUser(int stepNo, Entity.Domain.MarriageArrange entity, GetMarriageArrangeByUserRequest request, GetMarriageArrangeByUserResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                if (entity != null)
                {
                    Guid loginUserId = Guid.Parse(request.LoginUserId);

                    bool blSucceed = entity.ManUserId == loginUserId || entity.WomanUserId == loginUserId;
                    if (!blSucceed) return null;

                    response.AppMatchmakerName = entity.AppMatchmakerName;
                    response.ManUserName = entity.ManUserName;
                    response.MarriageAddress = entity.MarriageAddress;
                    response.MarriageArrangeId = entity.MarriageArrangeId;
                    response.MarriageContent = entity.MarriageContent;
                    response.MarriageDate = entity.MarriageDate.ToString("yyyy-MM-dd");
                    response.WomanUserName = entity.WomanUserName;
                }
                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageArrange>(stepNo, "以用户获取相亲安排", "GetMarriageArrangeByUser", response, execStep);
        }

        /// <summary>
        /// 以主键获取相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrangeId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetViewMarriageArrange(int stepNo, Guid marriageArrangeId, IResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                return _MarriageArrange.GetViewMarriageArrange(marriageArrangeId);
            };

            return this.GetEntityData<Entity.Domain.MarriageArrange>(stepNo, "以主键获取相亲安排", "GetMarriageArrange", response, execStep);
        }

        /// <summary>
        /// 以主键获取相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageArrangeId"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageArrange GetMarriageArrange(int stepNo, Guid marriageArrangeId, string loginUserId, IResponse response)
        {
            Func<Entity.Domain.MarriageArrange> execStep = () =>
            {
                Guid matchmakerId = Guid.Parse(loginUserId);

                var entity = _MarriageArrange.GetViewMarriageArrange(marriageArrangeId);

                if (entity != null && entity.ManMatchmakerId != matchmakerId && entity.WomanMatchmakerId != matchmakerId && entity.AppMatchmakerId != matchmakerId) return null;

                return entity;
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
        private Entity.Domain.MarriageUser GetUserInfoById(int stepNo, Entity.Domain.MarriageArrange marriageArrange, byte sex, IResponse response)
        {
            Func<Entity.Domain.MarriageUser> execStep = () =>
            {
                var entity = _MarriageUser.GetUserInfoById(sex == 1 ? marriageArrange.ManUserId : marriageArrange.WomanUserId);

                if (entity == null || entity.Status != 1) return null;
                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep);
        }

        /// <summary>
        /// 查询相亲安排
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageArrangeUser> QueryMarriageArrange(int stepNo, Entity.Domain.MarriageUser user, QueryMarriageArrangeRequest request, QueryMarriageArrangeResponse response)
        {
            if (user == null) return null;

            Func<List<Entity.Domain.MarriageArrangeUser>> execStep = () =>
            {
                List<Entity.Domain.MarriageArrangeUser> dataList = null;

                if (request.PageIndex > 0 && request.PageSize > 0)
                {
                    Parallel.Invoke(() =>
                    {
                        dataList = _MarriageArrange.QueryMarriageArrangeDataList(request, user.Sex);
                    },
                    () =>
                    {
                        response.PageInfo = _MarriageArrange.QueryMarriageArrangePageInfo(request, user.Sex);
                    });
                }
                else dataList = _MarriageArrange.QueryMarriageArrangeDataList(request, user.Sex);

                if (dataList != null) response.DataList = (from a in dataList
                                                           select GetMarriageUser(a)).ToList();

                return dataList;
            };

            return this.GetEntityDataList<Entity.Domain.MarriageArrangeUser>(stepNo, "查询相亲安排", "QueryUsersByMatchmaker", response, execStep, false);
        }

        MarriageArrangeUser GetMarriageUser(Entity.Domain.MarriageArrangeUser user)
        {
            return new MarriageArrangeUser()
            {
                Age = user.Age,
                HeadImgUrl = user.HeadImgUrl,
                NickName = user.NickName,
                Remark = user.Remark,
                UserId = user.UserId,
                MarriageArrangeId = user.MarriageArrangeId
            };
        }

        MarriageArrangeInfo GetMarriageArrangeInfo(Entity.Domain.MarriageArrange entity)
        {
            return new MarriageArrangeInfo()
            {
                ManAge = entity.ManAge,
                ManHeadImgUrl = entity.ManHeadImgUrl,
                ManUserName = entity.ManUserName,
                MarriageAddress = entity.MarriageAddress,
                MarriageDate = entity.MarriageDate.ToString("yyyy-MM-dd"),
                WomanAge = entity.WomanAge,
                WomanHeadImgUrl = entity.WomanHeadImgUrl,
                WomanUserName = entity.WomanUserName,
                MarriageArrangeId = entity.MarriageArrangeId
            };
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
                var entity = _MarriageUser.GetUserInfoById(Guid.Parse(userId));

                if (entity.Status != 1) return null;
                return entity;
            };

            return this.GetEntityData<Entity.Domain.MarriageUser>(stepNo, "以主键获取用户信息", "GetUserInfoById", response, execStep, false);
        }
    }
}
