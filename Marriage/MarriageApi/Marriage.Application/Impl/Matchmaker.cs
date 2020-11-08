using Marriage.Entity.Application;
using Marriage.Entity.Application.Matchmaker;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marriage.Application.Impl
{
    public class Matchmaker : BaseAction, IMatchmaker
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }

        public Domain.IMatchmaker _Matchmaker { get; set; }

        /// <summary>
        /// 获取用户红娘
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public GetUserMatchmakerResponse GetUserMatchmaker(GetUserMatchmakerRequest request)
        {
            string title = "获取用户红娘";
            string requestContent = Utility.Common.ToJson(request);
            GetUserMatchmakerResponse response = new GetUserMatchmakerResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            var user = GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、获取用户红娘
            stepNo += 1;
            GetUserMatchmaker(stepNo, user, response);

            //2、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<GetUserMatchmakerResponse>(title, "GetUserInfo", requestContent, response);
        }

        /// <summary>
        /// 获取用户红娘
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.Matchmaker GetUserMatchmaker(int stepNo, Entity.Domain.MarriageUser user, GetUserMatchmakerResponse response)
        {
            Func<Entity.Domain.Matchmaker> execStep = () =>
            {

                var entity = _Matchmaker.GetMatchmakerById(user.MatchmakerId);

                if (entity != null)
                {
                    response.MatchmakerInfo = new MatchmakerInfo2()
                    {
                        HeadImgUrl = entity.HeadImgUrl,
                        NickName = entity.NickName,
                        Phone = entity.Phone,
                        Sex = entity.Sex
                    };

                    response.Address = entity.Address;
                    response.City = entity.City;
                    response.Features = entity.Features;
                    response.Name = entity.Name;
                    response.Province = entity.Province;
                    response.Remark = entity.Remark;
                }

                return entity;
            };

            return this.GetEntityData<Entity.Domain.Matchmaker>(stepNo, "获取用户红娘", "GetUserMatchmakers", response, execStep);
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
    }
}
