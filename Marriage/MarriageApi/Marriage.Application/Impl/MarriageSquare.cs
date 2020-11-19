using Marriage.Entity.Application;
using Marriage.Entity.Application.MarriageSquare;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Marriage.Application.Impl
{
    /// <summary>
    /// 相亲广场
    /// </summary>
    public class MarriageSquare : BaseAction, IMarriageSquare
    {
        public Domain.IMarriageUser _MarriageUser { get; set; }
        public Domain.IMarriageSquare _MarriageSquare { get; set; }

        /// <summary>
        /// 查询相亲广场
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public QueryMarriageSquareResponse QueryMarriageSquare(QueryMarriageSquareRequest request)
        {
            string title = "查询相亲广场";
            string requestContent = Utility.Common.ToJson(request);
            QueryMarriageSquareResponse response = new QueryMarriageSquareResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //1、获取用户信息
            int stepNo = 1;
            Entity.Domain.MarriageUser user = this.GetUserInfoById(stepNo, request.LoginUserId, response);

            //2、查询相亲广场
            stepNo += 1;
            QueryMarriageSquare(stepNo, user, request, response);

            //3、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<QueryMarriageSquareResponse>(title, "QueryMarriageSquare", requestContent, response);
        }

        /// <summary>
        /// 更新相亲广场玫瑰数
        /// </summary>
        public UpdateMarriageSquareRoseCountResponse UpdateMarriageSquareRoseCount(UpdateMarriageSquareRoseCountRequest request)
        {
            string title = "更新相亲广场玫瑰数";
            string requestContent = Utility.Common.ToJson(request);
            UpdateMarriageSquareRoseCountResponse response = new UpdateMarriageSquareRoseCountResponse();

            this.InitMessage();

            this.IsNullRequest(request, response);

            //2、获取用户信息
            int stepNo = 1;
            Entity.Domain.MarriageUser user = GetMarriageSquareUserByUserId(stepNo, request.LoginUserId, request.UserId, response);

            stepNo += 1;
            var marriageSquare = GetMarriageSquareByUserId(stepNo, request.LoginUserId, request.UserId, response);

            //3、更新相亲广场玫瑰数
            stepNo += 1;
            UpdateMarriageSquareRoseCount(stepNo, marriageSquare, user, request, response);

            //4、执行结束
            this.ExecEnd(response);

            //日志记录
            return this.SetReturnResponse<UpdateMarriageSquareRoseCountResponse>(title, "UpdateMarriageSquareRoseCount", requestContent, response);
        }

        /// <summary>
        /// 更新相亲广场玫瑰数
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="marriageSquare"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private bool UpdateMarriageSquareRoseCount(int stepNo,Entity.Domain.MarriageSquare marriageSquare, Entity.Domain.MarriageUser user, UpdateMarriageSquareRoseCountRequest request, UpdateMarriageSquareRoseCountResponse response)
        {
            Func<bool> execStep = () =>
            {
                if (marriageSquare == null)
                {
                    if (request.IsSend) return _MarriageSquare.InsertMarriageSquare(Guid.Parse(request.LoginUserId), user.UserId);
                    else
                    {
                        this.SetValidateMessageRepsonse("已取消赠送", response);
                        return true;
                    }
                }
                else if (request.IsSend && marriageSquare.RoseCount > 999)
                {
                    this.SetValidateMessageRepsonse("最多只可赠送999朵玫瑰", response);
                    return true;
                }
                return _MarriageSquare.UpdateMarriageSquareRoseCount(Guid.Parse(request.LoginUserId), user.UserId, request.IsSend);
            };

            return this.UpdateEntityData(stepNo, "更新相亲广场玫瑰数", "UpdateMarriageSquareRoseCount", response, execStep);
        }


        /// <summary>
        /// 获取相亲广场
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private Entity.Domain.MarriageSquare GetMarriageSquareByUserId(int stepNo, string loginUserId, Guid userId, IResponse response)
        {
            Func<Entity.Domain.MarriageSquare> execStep = () =>
            {
                return _MarriageSquare.GetMarriageSquareByUserId(Guid.Parse(loginUserId), userId);
            };

            return this.GetEntityData<Entity.Domain.MarriageSquare>(stepNo, "获取相亲广场", "GetMarriageSquareUserByUserId", response, execStep, false);
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
        /// 查询相亲广场
        /// </summary>
        /// <param name="stepNo"></param>
        /// <param name="user"></param>
        /// <param name="request"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Entity.Domain.MarriageSquareUser> QueryMarriageSquare(int stepNo, Entity.Domain.MarriageUser user, QueryMarriageSquareRequest request, QueryMarriageSquareResponse response)
        {
            if (user == null) return null;

            Func<List<Entity.Domain.MarriageSquareUser>> execStep = () =>
            {
                List<Entity.Domain.MarriageSquareUser> dataList = null;

                if (request.PageIndex > 0 && request.PageSize > 0)
                {
                    Parallel.Invoke(() =>
                    {
                        dataList = _MarriageSquare.QueryMarriageSquareDataList(request, user.Sex);
                    },
                    () =>
                    {
                        response.PageInfo = _MarriageSquare.QueryMarriageSquarePageInfo(request, user.Sex);
                    });
                }
                else dataList = _MarriageSquare.QueryMarriageSquareDataList(request, user.Sex);

                if (dataList != null) response.DataList = (from a in dataList
                                                           select GetMarriageUser(a)).ToList();

                return dataList;
            };

            return this.GetEntityDataList<Entity.Domain.MarriageSquareUser>(stepNo, "查询相亲广场", "QueryUsersByMatchmaker", response, execStep, false);
        }

        MarriageSquareUser GetMarriageUser(Entity.Domain.MarriageSquareUser user)
        {
            return new MarriageSquareUser()
            {
                Age = user.Age,
                HeadImgUrl = user.HeadImgUrl,
                NickName = user.NickName,
                Remark = user.Remark,
                UserId = user.UserId,
                RoseCount = user.RoseCount,
                RoseCount2 = user.RoseCount2
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
